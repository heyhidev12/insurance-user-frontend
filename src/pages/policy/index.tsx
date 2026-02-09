import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import SEO from '@/components/SEO';
import { useFooter, FooterPolicy } from '@/context/FooterContext';
import styles from './policy.module.scss';

type PolicyType = 'TERMS' | 'PRIVACY';

const PolicyPage: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;
  const { fetchPolicy, policiesLoading, policiesError } = useFooter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [policy, setPolicy] = useState<FooterPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine policy type from URL
  const policyType: PolicyType = (type === 'PRIVACY' ? 'PRIVACY' : 'TERMS');

  // Page title based on policy type
  const pageTitle = policyType === 'TERMS' ? '서비스이용약관' : '개인정보처리방침';

  // Fetch policy data
  useEffect(() => {
    const loadPolicy = async () => {
      if (!type) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const policyData = await fetchPolicy(policyType);
        // policyData can be null if no data exists (empty array from API)
        // This is not an error, just no data available
        setPolicy(policyData);
      } catch (err) {
        setError('정책 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [type, policyType, fetchPolicy]);

  // Toggle menu
  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Close menu
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <SEO
        title={`${pageTitle} | 함께세무회계컨설팅`}
        description={`함께세무회계컨설팅 ${pageTitle} 안내`}
      />
      
      <div className={styles.policyPage}>
        <Header onMenuClick={handleToggleMenu} />
        <Menu isOpen={isMenuOpen} onClose={handleCloseMenu} />

        <main className={styles.main}>
          

          <div className={styles.contentWrapper}>
            <div className={styles.container}>
              {/* Loading State */}
              {(loading || policiesLoading) && (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner} />
                  <p>로딩 중...</p>
                </div>
              )}

              {/* Error State */}
              {(error || policiesError) && !loading && !policiesLoading && (
                <div className={styles.errorContainer}>
                  <p className={styles.errorText}>{error || policiesError}</p>
                  <button
                    type="button"
                    className={styles.retryButton}
                    onClick={() => router.reload()}
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* Policy Content */}
              {!loading && !policiesLoading && !error && !policiesError && policy && (
                <div className={styles.policyContent}>
                  {policy.title && (
                    <h2 className={styles.policyTitle}>{policy.title}</h2>
                  )}
                  <div className={styles.contentArea}>
                    {policy.content ? (
                      <div 
                        className={styles.htmlContent}
                        dangerouslySetInnerHTML={{ __html: policy.content }} 
                      />
                    ) : (
                      <p>내용이 없습니다.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Empty State - No data available */}
              {!loading && !policiesLoading && !error && !policiesError && !policy && (
                <div className={styles.emptyContainer}>
                  <p>등록된 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PolicyPage;
