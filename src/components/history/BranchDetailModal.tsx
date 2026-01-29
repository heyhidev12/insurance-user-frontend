import React, { useEffect, useRef } from 'react';
import styles from './BranchDetailModal.module.scss';

interface BranchItem {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string | null;
  fax: string | null;
  email: string | null;
  blogUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  busInfo: string | null;
  subwayInfo: string | null;
  taxiInfo: string | null;
  displayOrder: number;
  isExposed: boolean;
}

interface BranchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchItem | null;
}

const BranchDetailModal: React.FC<BranchDetailModalProps> = ({
  isOpen,
  onClose,
  branch,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // URL에 http/https가 없으면 https:// 추가
  const formatUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 네이버 지도 초기화
  useEffect(() => {
    if (!isOpen || !branch || !mapRef.current) return;

    const initMap = () => {
      if (!(window as any).naver || !(window as any).naver.maps) {
        return;
      }

      const lat = typeof branch.latitude === 'string' ? parseFloat(branch.latitude) : branch.latitude;
      const lng = typeof branch.longitude === 'string' ? parseFloat(branch.longitude) : branch.longitude;

      // 좌표가 없으면 기본 위치 (서울 시청)
      const center = lat && lng && !isNaN(lat) && !isNaN(lng)
        ? new (window as any).naver.maps.LatLng(lat, lng)
        : new (window as any).naver.maps.LatLng(37.5665, 126.9780);

      // 기존 지도 인스턴스 제거
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      // 지도 생성
      mapInstanceRef.current = new (window as any).naver.maps.Map(mapRef.current, {
        center: center,
        zoom: 16,
      });

      // 커스텀 마커 생성
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        const markerContent = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 10px;
              background: white;
              border: 1px solid #c6c6c6;
              border-radius: 100px;
              padding: 6px 16px 6px 6px;
              box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
              white-space: nowrap;
            ">
              <div style="
                width: 32px;
                height: 32px;
                background: #bd2625;
                border-radius: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
                </svg>
              </div>
              <span style="
                font-family: 'Pretendard', sans-serif;
                font-size: 15px;
                font-weight: 600;
                color: #1d1d1d;
              ">${branch.name}</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid white;
              margin-left: 18px;
              filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
            "></div>
          </div>
        `;

        new (window as any).naver.maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          icon: {
            content: markerContent,
            anchor: new (window as any).naver.maps.Point(80, 58),
          },
        });
      }
    };

    // API가 로드될 때까지 대기
    const checkAndInit = () => {
      if ((window as any).naver && (window as any).naver.maps) {
        setTimeout(initMap, 100);
      } else {
        setTimeout(checkAndInit, 100);
      }
    };

    checkAndInit();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, branch]);

  if (!isOpen || !branch) return null;

  const hasSocialLinks = branch.blogUrl || branch.youtubeUrl || branch.instagramUrl || branch.websiteUrl;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12L28 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M28 12L12 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalScrollContent}>
            <div className={styles.branchInfo}>
              <div className={styles.branchTitleRow}>
                <h2 className={styles.branchName}>{branch.name}</h2>
                {hasSocialLinks && (
                  <div className={styles.socialLinks}>
                    {branch.blogUrl && (
                      <a href={formatUrl(branch.blogUrl)} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <img src="/images/branches/icons/naver-blog.svg" alt="Naver Blog" />
                      </a>
                    )}
                    {branch.blogUrl && (branch.youtubeUrl || branch.instagramUrl || branch.websiteUrl) && (
                      <span className={styles.socialDivider} />
                    )}
                    {branch.youtubeUrl && (
                      <>
                        <a href={formatUrl(branch.youtubeUrl)} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                          <img src="/images/branches/icons/youtube.svg" alt="YouTube" />
                        </a>
                        {(branch.instagramUrl || branch.websiteUrl) && (
                          <span className={styles.socialDivider} />
                        )}
                      </>
                    )}
                    {branch.instagramUrl && (
                      <>
                        <a href={formatUrl(branch.instagramUrl)} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                          <img src="/images/branches/icons/instagram.svg" alt="Instagram" />
                        </a>
                        {branch.websiteUrl && (
                          <span className={styles.socialDivider} />
                        )}
                      </>
                    )}
                    {branch.websiteUrl && (
                      <a href={formatUrl(branch.websiteUrl)} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <img src="/images/branches/icons/website.svg" alt="Website" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.mapSection}>
              <div ref={mapRef} className={styles.map} />
            </div>

            <div className={styles.transportInfo}>
              <div className={styles.transportRow}>
                <span className={styles.transportLabel}>버스 이용 시</span>
                <span className={styles.transportValue}>{branch.busInfo || '-'}</span>
              </div>
              <div className={styles.transportRow}>
                <span className={styles.transportLabel}>지하철 이용 시</span>
                <span className={styles.transportValue}>{branch.subwayInfo || '-'}</span>
              </div>
              <div className={styles.transportRow}>
                <span className={styles.transportLabel}>택시 이용 시</span>
                <span className={styles.transportValue}>{branch.taxiInfo || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailModal;
