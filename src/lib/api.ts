/**
 * API Client Utility
 *
 * fetch 기반의 API 클라이언트입니다.
 * 인증 토큰 처리, 에러 핸들링, 토큰 갱신 등을 포함합니다.
 */

import { API_BASE_URL, API_TIMEOUT, API_ENDPOINTS } from '@/config/api';

// API 응답 타입
interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// 요청 옵션 타입
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
  skipAuthRefresh?: boolean; // 토큰 갱신 스킵 여부 (refresh 요청 자체에 사용)
}

// Refresh 응답 타입
interface RefreshResponse {
  accessToken: string;
}

// 토큰 갱신 상태 관리
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * 인증 토큰 가져오기
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * 인증 토큰 저장하기
 */
// api.ts faylida
export const setAuthToken = (token: string, rememberMe: boolean = false) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('accessToken', token);
  
  // 토큰 만료 시간 계산 (autoLogin: true → 1주일, false → 15분)
  const expirationTime = new Date();
  if (rememberMe) {
    expirationTime.setDate(expirationTime.getDate() + 7); // 1주일
  } else {
    expirationTime.setMinutes(expirationTime.getMinutes() + 15); // 15분
  }
  
  localStorage.setItem('tokenExpiration', expirationTime.toISOString());
  localStorage.setItem('rememberMe', rememberMe.toString());
};

/**
 * 로그아웃 처리 (토큰 및 사용자 정보 삭제)
 */
const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

/**
 * 토큰 갱신 대기열에 콜백 추가
 */
const subscribeTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

/**
 * 토큰 갱신 완료 후 대기 중인 요청들에 새 토큰 전달
 */
const onTokenRefreshed = (newToken: string): void => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

/**
 * 토큰 갱신 실패 시 대기열 초기화
 */
const onRefreshFailed = (): void => {
  refreshSubscribers = [];
};

/**
 * 타임아웃이 있는 fetch
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * 토큰 갱신 요청
 */
const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // refresh token cookie 전송
      },
      API_TIMEOUT
    );

    if (!response.ok) {
      return null;
    }

    const data: RefreshResponse = await response.json();
    
    if (data.accessToken) {
      setAuthToken(data.accessToken);
      return data.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * API 요청 함수 (토큰 갱신 로직 포함)
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, timeout = API_TIMEOUT, headers: customHeaders, skipAuthRefresh = false, ...restOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  const buildHeaders = (authToken: string | null): Record<string, string> => {
    const headers: Record<string, string> = {
      ...(customHeaders as Record<string, string>),
    };

    // GET 요청이 아니거나 body가 있을 때만 Content-Type 추가
    const method = restOptions.method || 'GET';
    if (method !== 'GET' && method !== 'HEAD' || body) {
      headers['Content-Type'] = 'application/json';
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  };

  const makeFetchOptions = (authToken: string | null): RequestInit => ({
    ...restOptions,
    headers: buildHeaders(authToken),
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // cookie 전송을 위해 추가
  });

  try {
    let response = await fetchWithTimeout(url, makeFetchOptions(token), timeout);
    let data = await response.json().catch(() => null);

    // 401 에러 시 토큰 갱신 시도
    if (response.status === 401 && !skipAuthRefresh && token) {
      // 이미 갱신 중인 경우 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(async (newToken) => {
            // 새 토큰으로 원래 요청 재시도
            const retryResponse = await fetchWithTimeout(url, makeFetchOptions(newToken), timeout);
            const retryData = await retryResponse.json().catch(() => null);
            
            if (!retryResponse.ok) {
              resolve({
                error: retryData?.message || `HTTP Error: ${retryResponse.status}`,
                status: retryResponse.status,
              });
            } else {
              resolve({
                data: retryData,
                status: retryResponse.status,
              });
            }
          });
        });
      }

      // 토큰 갱신 시작
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          // 갱신 성공: 대기 중인 요청들에 새 토큰 전달
          isRefreshing = false;
          onTokenRefreshed(newToken);

          // 원래 요청 재시도
          response = await fetchWithTimeout(url, makeFetchOptions(newToken), timeout);
          data = await response.json().catch(() => null);

          if (!response.ok) {
            return {
              error: data?.message || `HTTP Error: ${response.status}`,
              status: response.status,
            };
          }

          return {
            data,
            status: response.status,
          };
        } else {
          // 갱신 실패: 로그아웃 처리
          isRefreshing = false;
          onRefreshFailed();
          clearAuth();
          
          // 로그인 페이지로 리다이렉트 (선택적)
          if (typeof window !== 'undefined') {
            // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          
          return {
            error: '세션이 만료되었습니다. 다시 로그인해주세요.',
            status: 401,
          };
        }
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed();
        clearAuth();
        
        return {
          error: '인증 갱신에 실패했습니다. 다시 로그인해주세요.',
          status: 401,
        };
      }
    }

    if (!response.ok) {
      return {
        error: data?.message || `HTTP Error: ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          error: '요청 시간이 초과되었습니다.',
          status: 408,
        };
      }
      return {
        error: error.message,
        status: 0,
      };
    }
    return {
      error: '알 수 없는 오류가 발생했습니다.',
      status: 0,
    };
  }
};

/**
 * GET 요청
 */
export const get = <T = unknown>(endpoint: string, options?: RequestOptions) =>
  apiRequest<T>(endpoint, { ...options, method: 'GET' });

/**
 * POST 요청
 */
export const post = <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
  apiRequest<T>(endpoint, { ...options, method: 'POST', body });

/**
 * PATCH 요청
 */
export const patch = <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
  apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });

/**
 * DELETE 요청
 */
export const del = <T = unknown>(endpoint: string, options?: RequestOptions) =>
  apiRequest<T>(endpoint, { ...options, method: 'DELETE' });

/**
 * 파일 업로드 (multipart/form-data) - 토큰 갱신 로직 포함
 */
export const uploadFile = async <T = unknown>(
  endpoint: string,
  file: File,
  fieldName = 'file'
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  const createFormData = (): FormData => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
  };

  const buildHeaders = (authToken: string | null): HeadersInit => {
    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  };

  const makeFetchOptions = (authToken: string | null): RequestInit => ({
    method: 'POST',
    headers: buildHeaders(authToken),
    body: createFormData(),
    credentials: 'include',
  });

  try {
    let response = await fetchWithTimeout(url, makeFetchOptions(token), API_TIMEOUT);
    let data = await response.json().catch(() => null);

    // 401 에러 시 토큰 갱신 시도
    if (response.status === 401 && token) {
      // 이미 갱신 중인 경우 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(async (newToken) => {
            const retryResponse = await fetchWithTimeout(url, makeFetchOptions(newToken), API_TIMEOUT);
            const retryData = await retryResponse.json().catch(() => null);
            
            if (!retryResponse.ok) {
              resolve({
                error: retryData?.message || `HTTP Error: ${retryResponse.status}`,
                status: retryResponse.status,
              });
            } else {
              resolve({
                data: retryData,
                status: retryResponse.status,
              });
            }
          });
        });
      }

      // 토큰 갱신 시작
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          isRefreshing = false;
          onTokenRefreshed(newToken);

          response = await fetchWithTimeout(url, makeFetchOptions(newToken), API_TIMEOUT);
          data = await response.json().catch(() => null);

          if (!response.ok) {
            return {
              error: data?.message || `HTTP Error: ${response.status}`,
              status: response.status,
            };
          }

          return {
            data,
            status: response.status,
          };
        } else {
          isRefreshing = false;
          onRefreshFailed();
          clearAuth();
          
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          
          return {
            error: '세션이 만료되었습니다. 다시 로그인해주세요.',
            status: 401,
          };
        }
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed();
        clearAuth();
        
        return {
          error: '인증 갱신에 실패했습니다. 다시 로그인해주세요.',
          status: 401,
        };
      }
    }

    if (!response.ok) {
      return {
        error: data?.message || `HTTP Error: ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
        status: 0,
      };
    }
    return {
      error: '파일 업로드 중 오류가 발생했습니다.',
      status: 0,
    };
  }
};

export default {
  get,
  post,
  patch,
  del,
  uploadFile,
  request: apiRequest,
};
