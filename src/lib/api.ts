/**
 * API Client Utility
 *
 * fetch 기반의 API 클라이언트입니다.
 * 인증 토큰 처리, 에러 핸들링 등을 포함합니다.
 */

import { API_BASE_URL, API_TIMEOUT } from '@/config/api';

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
}

/**
 * 인증 토큰 가져오기
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
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
 * API 요청 함수
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { body, timeout = API_TIMEOUT, headers: customHeaders, ...restOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  // GET 요청이 아니거나 body가 있을 때만 Content-Type 추가
  const method = restOptions.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD' || body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetchWithTimeout(url, fetchOptions, timeout);
    const data = await response.json().catch(() => null);

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
 * 파일 업로드 (multipart/form-data)
 */
export const uploadFile = async <T = unknown>(
  endpoint: string,
  file: File,
  fieldName = 'file'
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers,
        body: formData,
      },
      API_TIMEOUT
    );

    const data = await response.json().catch(() => null);

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
