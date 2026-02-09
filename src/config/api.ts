/**
 * API Configuration
 *
 * 환경에 따라 API 베이스 URL을 관리합니다.
 * 환경 변수를 통해 오버라이드할 수 있습니다.
 */

// API 베이스 URL (환경 변수로 오버라이드 가능)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.124.98.132:3000';

// API 엔드포인트
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGN_UP: '/auth/sign-up',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    CHECK_ID: '/auth/check-id',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_PASSWORD: '/auth/verify-password',
    DELETE_ACCOUNT: '/auth/me',  // DELETE method
    MY_APPLICATIONS: '/auth/me/applications',
    // 휴대폰 인증
    PHONE_SEND: '/auth/phone/send',
    PHONE_VERIFY: '/auth/phone/verify',
    // ID 찾기
    FIND_ID_EMAIL_SEND: '/auth/find-id/email/send',
    FIND_ID_PHONE_SEND: '/auth/find-id/phone/send',
    FIND_ID_EMAIL_VERIFY: '/auth/find-id/email/verify',
    FIND_ID_PHONE_VERIFY: '/auth/find-id/phone/verify',
    // 비밀번호 찾기
    FIND_PASSWORD_EMAIL_SEND: '/auth/find-password/email/send',
    FIND_PASSWORD_PHONE_SEND: '/auth/find-password/phone/send',
    FIND_PASSWORD_EMAIL_VERIFY: '/auth/find-password/email/verify',
    FIND_PASSWORD_PHONE_VERIFY: '/auth/find-password/phone/verify',
    RESET_PASSWORD: '/auth/reset-password',
    // OAuth
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    KAKAO: '/auth/kakao',
    KAKAO_CALLBACK: '/auth/kakao/callback',
    NAVER: '/auth/naver',
    NAVER_CALLBACK: '/auth/naver/callback',
  },

  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    VIDEO_PRESIGNED_URL: '/upload/video/presigned-url',
  },

  // Content (Public)
  MEMBERS: '/members',
  HISTORY: '/history/all',
  AWARDS: '/awards',
  AWARDS_ALL: '/awards/all',
  TRAINING_SEMINARS: '/training-seminars',
  BANNERS: '/banners',
  BRANCHES: '/branches',
  KEY_CUSTOMERS: '/key-customers',
  BUSINESS_AREAS: '/business-areas',
  BUSINESS_AREAS_HIERARCHICAL: '/business-areas/hierarchical',
  BUSINESS_AREAS_CATEGORIES: '/business-areas/categories',
  INSIGHTS: '/insights',
  INSIGHTS_HIERARCHICAL: '/insights/hierarchical',

  // Consultations
  CONSULTATIONS: '/consultations',

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
    UNSUBSCRIBE: '/newsletter/unsubscribe',
    ME: '/newsletter/me',
    ME_UNSUBSCRIBE: '/newsletter/me/unsubscribe',
    PAGE: '/newsletter-page',
  },

  // Data Rooms (자료실)
  // DATA_ROOMS: '/data-rooms',

  // Footer
  FOOTER: {
    POLICIES: '/footer/policies',
    FAMILY_SITES: '/footer/family-sites',
  },
} as const;

// API 요청 타임아웃 (ms)
export const API_TIMEOUT = 30000;

// API 버전 (필요시 사용)
export const API_VERSION = 'v1';
