/**
 * 교육/세미나 관련 타입 정의
 */

export type EducationType = 'SEMINAR' | 'TRAINING' | 'LECTURE' | 'VOD';
export type RecruitmentType = 'FIRST_COME' | 'SELECTION';
export type TargetMemberType = 'ALL' | 'MEMBER' | 'NON_MEMBER';

export interface EducationImage {
  id: number;
  url: string;
}

export interface EducationItem {
  no: number;
  id: number;
  name: string;
  type: EducationType;
  typeLabel: string;
  recruitmentType: RecruitmentType;
  recruitmentTypeLabel: string;
  recruitmentEndDate: string;
  image: EducationImage;
  targetMemberType: TargetMemberType;
  targetMemberTypeLabel: string;
  educationDates: string[];
  educationTimeSlots: string[];
  location: string;
  otherInfo: string | null;
  quota: number;
  applicationCount: number;
  isExposed: boolean;
  exposedLabel: string;
  isRecommended: boolean;
}

export interface EducationListResponse {
  items: EducationItem[];
  total: number;
  page: number;
  limit: number;
}

// 사용자 신청 상태
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface UserApplication {
  id: number;
  status: ApplicationStatus;
  applicationDate: string;
}

export interface EducationDetail extends EducationItem {
  instructorName: string;
  target: string;
  body: string;
  vimeoVideoUrl: string | null;
  applications: any[];
  userApplication?: UserApplication | null; // 현재 사용자의 신청 정보
  isRecruitmentClosed?: boolean; // 모집 종료 여부
}





