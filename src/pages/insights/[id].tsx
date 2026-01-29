import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { get, post, del } from '@/lib/api';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import styles from './detail.module.scss';

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface InsightThumbnail {
  url: string;
}

interface InsightCategory {
  id: number;
  name: string;
  type: string;
}

interface InsightSubcategory {
  id: number;
  name: string;
  sections: string[];
}

interface Attachment {
  id: number;
  name: string;
  originalName: string;
  url?: string;
}

interface PdfFile {
  url: string;
}

interface InsightDetail {
  id: number;
  title: string;
  content: string;
  thumbnail?: InsightThumbnail;
  category: InsightCategory;
  subcategory?: InsightSubcategory;
  enableComments: boolean;
  isExposed: boolean;
  isMainExposed: boolean;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  attachments?: Attachment[];
  pdf?: PdfFile;
}

interface InsightNavigation {
  id: number;
  title: string;
}

interface CommentMember {
  id: number;
  name?: string;
  loginId?: string;
}

interface Comment {
  id: number;
  body: string;
  authorName?: string;
  memberId?: number;
  authorId?: number;
  userId?: number;
  member?: CommentMember;
  createdAt: string;
  createdAtFormatted?: string;
  isHidden?: boolean;
  isReported?: boolean;
  isMine?: boolean;
}

interface CommentsResponse {
  items: Comment[];
  total: number;
}

const InsightDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [insight, setInsight] = useState<InsightDetail | null>(null);
  const [prevInsight, setPrevInsight] = useState<InsightNavigation | null>(null);
  const [nextInsight, setNextInsight] = useState<InsightNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: number; name?: string; loginId?: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetchInsightDetail();
    }
    
    // 로그인 상태 확인 및 사용자 정보 가져오기
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
      
      // 로그인된 경우 사용자 정보 가져오기
      if (token) {
        fetchCurrentUser();
      }
    }
  }, [id]);

  const fetchInsightDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      // 상세 데이터 가져오기
      const response = await get<InsightDetail>(
        `${API_ENDPOINTS.INSIGHTS}/${id}`
      );

      if (response.data) {
        // API 응답 확인용 로그 (개발 중에만)
        if (process.env.NODE_ENV === 'development') {
          console.log('Insight data:', response.data);
          console.log('PDF:', response.data.pdf);
        }

        setInsight(response.data);

        // 댓글이 활성화되어 있으면 댓글 목록 가져오기
        if (response.data.enableComments) {
          // 토큰이 있는지 직접 확인 (state보다 정확)
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          if (token) {
            // 사용자 정보를 먼저 가져온 후 댓글 가져오기
            const user = await fetchCurrentUser();
            fetchComments(user);
          } else {
            fetchComments(null);
          }
        }
        
        // 조회수 증가 (클라이언트에서만 실행, 매번 페이지 열 때마다 실행)
        if (typeof window !== 'undefined') {
          try {
            await post(`${API_ENDPOINTS.INSIGHTS}/${id}/increment-view`);
          } catch (err) {
            // 조회수 증가 실패는 무시 (에러 로그만 출력)
            console.log('조회수 증가 실패:', err);
          }
        }
        
        // 이전/다음 글 가져오기
        // 먼저 초기화
        setPrevInsight(null);
        setNextInsight(null);
        
        try {
          const navResponse = await get<{ items: InsightDetail[] }>(
            `${API_ENDPOINTS.INSIGHTS}?page=1&limit=100`
          );

          if (navResponse.data && navResponse.data.items) {
            const items = navResponse.data.items;
            const currentIndex = items.findIndex(item => item.id === Number(id));
            
            // 현재 글을 찾았을 때만 처리
            if (currentIndex >= 0) {
              // 이전 글 설정
              if (currentIndex > 0) {
                setPrevInsight({
                  id: items[currentIndex - 1].id,
                  title: items[currentIndex - 1].title
                });
              }
              
              // 다음 글 설정
              if (currentIndex < items.length - 1) {
                setNextInsight({
                  id: items[currentIndex + 1].id,
                  title: items[currentIndex + 1].title
                });
              }
            }
          }
        } catch (err) {
          // 네비게이션 실패는 무시
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleBackToList = () => {
    router.push('/insights');
  };

  const handlePrevClick = () => {
    if (prevInsight && prevInsight.id) {
      router.push(`/insights/${prevInsight.id}`);
    }
  };

  const handleNextClick = () => {
    if (nextInsight && nextInsight.id) {
      router.push(`/insights/${nextInsight.id}`);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    const title = insight?.title || '인사이트';
    const text = `${title} - 세무 상담`;

    try {
      // Web Share API가 지원되는 경우
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        // Web Share API가 지원되지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(url);
        alert('링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      // 사용자가 공유를 취소한 경우 등 에러는 무시
      if (error instanceof Error && error.name !== 'AbortError') {
        // 클립보드 복사로 폴백
        try {
          await navigator.clipboard.writeText(url);
          alert('링크가 클립보드에 복사되었습니다.');
        } catch (clipboardError) {
          console.error('공유 실패:', clipboardError);
        }
      }
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    try {
      // API에서 제공하는 실제 파일 URL을 직접 사용
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank'; // 새 탭에서 열기
      link.rel = 'noopener noreferrer'; // 보안을 위해
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const fetchCurrentUser = async (): Promise<{ id?: number; name?: string; loginId?: string } | null> => {
    try {
      const response = await get<{ id: number; name: string; loginId: string }>(
        API_ENDPOINTS.AUTH.ME
      );
      
      if (response.data) {
        setCurrentUser(response.data);
        return response.data;
      } else {
        // localStorage에서 사용자 정보 가져오기 (fallback)
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const userInfo = { id: user.id, name: user.name, loginId: user.loginId };
            setCurrentUser(userInfo);
            return userInfo;
          } catch (e) {
            // 파싱 실패 시 무시
            return null;
          }
        }
        return null;
      }
    } catch (err) {
      // 인증 실패 시 localStorage에서 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userInfo = { id: user.id, name: user.name, loginId: user.loginId };
          setCurrentUser(userInfo);
          return userInfo;
        } catch (e) {
          // 파싱 실패 시 무시
          return null;
        }
      }
      return null;
    }
  };

  const fetchComments = async (user?: { id?: number; name?: string; loginId?: string } | null) => {
    if (!id) return;
    
    // currentUser state 또는 파라미터로 전달된 user 사용
    const userToCompare = user !== undefined ? user : currentUser;
    
    try {
      const response = await get<CommentsResponse>(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments`
      );
      
      if (response.data) {
        // 디버깅용 로그
        if (process.env.NODE_ENV === 'development') {
          console.log('댓글 API 응답:', response.data);
          console.log('현재 사용자:', userToCompare);
        }
        
        // isMine 필드가 없거나 false인 경우, 현재 사용자와 비교해서 설정
        const commentsWithIsMine = (response.data.items || []).map((comment) => {
          // API에서 isMine이 이미 true로 오면 그대로 사용
          if (comment.isMine === true) {
            return comment;
          }

          // API에서 isMine이 없거나 false인 경우, 현재 사용자와 비교
          if (userToCompare && userToCompare.id) {
            let isMyComment = false;

            // 1. member.id와 현재 사용자 id 비교 (가장 정확)
            if (comment.member?.id) {
              isMyComment = comment.member.id === userToCompare.id;
            }

            // 2. memberId와 현재 사용자 id 비교
            if (!isMyComment && comment.memberId) {
              isMyComment = comment.memberId === userToCompare.id;
            }

            // 3. authorId 또는 userId와 현재 사용자 id 비교
            if (!isMyComment && (comment.authorId || comment.userId)) {
              isMyComment = (comment.authorId === userToCompare.id) ||
                           (comment.userId === userToCompare.id);
            }

            // 4. authorName과 현재 사용자 name 또는 loginId 비교
            if (!isMyComment && comment.authorName && (userToCompare.name || userToCompare.loginId)) {
              isMyComment = comment.authorName === userToCompare.name ||
                           comment.authorName === userToCompare.loginId;
            }

            if (process.env.NODE_ENV === 'development') {
              console.log(`댓글 ${comment.id}:`, {
                authorName: comment.authorName,
                memberId: comment.memberId,
                memberObjId: comment.member?.id,
                authorId: comment.authorId,
                userId: comment.userId,
                currentUserId: userToCompare.id,
                currentUserName: userToCompare.name,
                currentUserLoginId: userToCompare.loginId,
                isMyComment
              });
            }

            return { ...comment, isMine: isMyComment };
          }

          return { ...comment, isMine: false };
        });
        
        setComments(commentsWithIsMine);
        setCommentTotal(response.data.total || 0);
      }
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentText.trim() || isSubmittingComment) return;

    // 로그인 체크
    if (!isAuthenticated) {
      if (confirm('댓글을 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login');
      }
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await post<Comment>(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments`,
        { body: commentText.trim() }
      );

      if (response.data) {
        const newComment = response.data;
        setCommentText('');

        // 새로 작성한 댓글은 무조건 isMine: true로 설정하여 즉시 추가
        const newCommentWithIsMine: Comment = {
          ...newComment,
          isMine: true,
        };

        // 댓글 목록에 새 댓글을 직접 추가 (맨 앞 또는 맨 뒤에 추가)
        setComments(prevComments => [...prevComments, newCommentWithIsMine]);
        setCommentTotal(prevTotal => prevTotal + 1);
      } else if (response.error) {
        if (response.status === 401) {
          alert('로그인이 필요합니다.');
          router.push('/login');
        } else {
          alert(response.error);
        }
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!id || !confirm('댓글을 삭제하시겠습니까?')) return;
    
    // 로그인 체크
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      const response = await del(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments/${commentId}`
      );
      
      if (!response.error) {
        // 댓글 목록 새로고침
        await fetchComments(currentUser);
      } else {
        if (response.status === 401) {
          alert('로그인이 필요합니다.');
          router.push('/login');
        } else if (response.status === 403) {
          alert('본인의 댓글만 삭제할 수 있습니다.');
        } else {
          alert(response.error);
        }
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReportComment = async (commentId: number) => {
    if (!id || !confirm('이 댓글을 신고하시겠습니까?')) return;
    
    // 로그인 체크
    if (!isAuthenticated) {
      if (confirm('댓글을 신고하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login');
      }
      return;
    }
    
    try {
      const response = await post(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments/${commentId}/report`,
        {}
      );
      
      if (!response.error) {
        alert('신고가 접수되었습니다.');
      } else {
        if (response.status === 401) {
          alert('로그인이 필요합니다.');
          router.push('/login');
        } else if (response.status === 403) {
          alert('본인의 댓글은 신고할 수 없습니다.');
        } else {
          alert(response.error);
        }
      }
    } catch (err) {
      console.error('댓글 신고 실패:', err);
      alert('댓글 신고 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || '인사이트를 찾을 수 없습니다.'}</p>
            <Button onClick={handleBackToList}>목록으로 돌아가기</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={() => router.push('/consultation/apply')}
        />
        <FloatingButton
          variant="top"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headerSection}>
            <div className={styles.titleWrapper}>
              <div className={styles.category}>{typeof insight.subcategory?.name === 'string' ? insight.subcategory.name : (typeof insight.category?.name === 'string' ? insight.category.name : '카테고리명')}</div>
              <h1 className={styles.title}>{insight.title}</h1>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaLeft}>
                <span className={styles.author}>작성자명</span>
                <span className={styles.divider}>|</span>
                <span className={styles.date}>{formatDate(insight.createdAt)}</span>
              </div>
              <div className={styles.metaRight}>
                <img
                  src="/images/insights/icons/printer.svg"
                  alt="프린트"
                  className={styles.icon}
                  onClick={handlePrint}
                />
                <span className={styles.iconDivider} />
                <img
                  src="/images/insights/icons/share.svg"
                  alt="공유"
                  className={styles.icon}
                  onClick={handleShare}
                />
              </div>
            </div>
          </div>

          <div className={styles.bodySection}>
            {insight.thumbnail && (
              <div className={styles.imageSection}>
                <img src={insight.thumbnail.url} alt={insight.title} />
              </div>
            )}
            <div className={styles.bodyContent}>
              <Viewer initialValue={insight.content.replace(/\*\*\*/g, '')} />
            </div>
          </div>

          {insight.pdf?.url && (
            <div className={styles.attachmentsSection}>
              <h2 className={styles.attachmentsTitle}>첨부파일</h2>
              <div className={styles.attachmentsList}>
                <div className={styles.attachmentItem}>
                  <div className={styles.attachmentLeft}>
                    <div className={styles.attachmentLabel}>1</div>
                    <div className={styles.attachmentInfo}>
                      <Icon type="document" size={24} className={styles.attachmentIcon} />
                      <span className={styles.attachmentName}>
                        {insight.pdf.url.split('/').pop() || '첨부 파일.pdf'}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.downloadButton}
                    onClick={() => {
                      const fileName = insight.pdf?.url.split('/').pop() || '첨부 파일.pdf';
                      handleDownload(insight.pdf!.url, fileName);
                    }}
                  >
                    <span className={styles.downloadButtonText}>다운로드</span>
                    <Icon type="download-white" size={20} className={styles.downloadIcon} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {insight.enableComments && (
            <div className={styles.commentsSection}>
              <div className={styles.commentsDivider} />
              <div className={styles.commentsContent}>
                <div className={styles.commentsHeader}>
                  <h2 className={styles.commentsTitle}>댓글</h2>
                  <p className={styles.commentsDescription}>칼럼을 읽고 댓글을 남겨주세요.</p>
                </div>
                
                <div className={styles.commentForm}>
                  <div className={styles.commentFormHeader}>
                    <span className={styles.commentAuthor}>작성자명</span>
                  </div>
                  <div className={styles.commentInputWrapper}>
                    <textarea
                      className={styles.commentInput}
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <button
                    className={styles.commentSubmitButton}
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                  >
                    등록
                  </button>
                </div>

                <div className={styles.commentsListHeader}>
                  <h3 className={styles.commentsTotalTitle}>
                    총 댓글 <span className={styles.commentsTotalCount}>{commentTotal}</span>
                  </h3>
                </div>

                <div className={styles.commentsList}>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`${styles.commentItem} ${comment.isHidden ? styles.commentHidden : ''}`}
                      >
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthorName}>{comment.authorName || ''}</span>
                          {isAuthenticated && (
                            <>
                              {comment.isMine ? (
                                <button
                                  className={styles.commentAction}
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  삭제
                                </button>
                              ) : (
                                <button
                                  className={styles.commentAction}
                                  onClick={() => handleReportComment(comment.id)}
                                >
                                  신고
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <p className={styles.commentContent}>
                          {comment.isHidden
                            ? '해당 댓글은 다수 사용자의 신고에 의해 가려졌습니다.'
                            : comment.body}
                        </p>
                        <p className={styles.commentDate}>{formatDate(comment.createdAt)}</p>
                        <div className={styles.commentDivider} />
                      </div>
                    ))
                  ) : (
                    <p className={styles.noComments}>아직 댓글이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={styles.navigationSection}>
            <div className={styles.dividerLine} />
            <div className={styles.navigation}>
              <div className={styles.navItem} onClick={handlePrevClick}>
                {prevInsight ? (
                  <>
                    <Icon type="arrow-left-gray" size={24} className={styles.navIcon} />
                    <span className={styles.navLabel}>이전 글</span>
                    <span className={styles.navTitle}>{prevInsight.title}</span>
                  </>
                ) : (
                  <div className={styles.navEmpty}>이전 글이 없습니다</div>
                )}
              </div>
              <div className={`${styles.navItem} ${styles.navItemNext}`} onClick={handleNextClick}>
                {nextInsight ? (
                  <>
                    <span className={styles.navLabel}>다음 글</span>
                    <span className={styles.navTitle}>{nextInsight.title}</span>
                    <Icon type="arrow-right-gray" size={24} className={styles.navIcon} />
                  </>
                ) : (
                  <div className={styles.navEmpty}>다음 글이 없습니다</div>
                )}
              </div>
            </div>
            <Button
              type="line-white"
              size="large"
              onClick={handleBackToList}
              leftIcon="list-white"
              className={styles.backButton}
            >
              목록보기
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InsightDetailPage;

