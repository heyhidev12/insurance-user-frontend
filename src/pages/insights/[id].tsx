import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import SEO from '@/components/SEO';
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

interface InsightSubminorCategory {
  id: number;
  name: string;
}

interface Attachment {
  id: number;
  name: string;
  originalName: string;
  url?: string;
}

interface InsightFile {
  id: number;
  fileName: string;
  url: string;
  type: 'DOCUMENT' | 'IMAGE';
}

interface InsightDetail {
  id: number;
  title: string;
  content: string;
  thumbnail?: InsightThumbnail;
  category: InsightCategory;
  subcategory?: InsightSubcategory;
  subMinorCategory?: InsightSubminorCategory;
  enableComments: boolean;
  isExposed: boolean;
  isMainExposed: boolean;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  attachments?: Attachment[];
  files?: InsightFile[];
  authorName?: string;
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

  // Asosiy insight data ni yuklash
  const fetchInsightDetail = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await get<InsightDetail>(
        `${API_ENDPOINTS.INSIGHTS}/${id}`
      );

      if (response.data) {
        setInsight(response.data);

        // 댓글이 활성화되어 있으면 댓글 목록 가져오기
        if (response.data.enableComments) {
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          if (token) {
            await fetchCurrentUser();
            fetchComments(currentUser);
          } else {
            fetchComments(null);
          }
        }

        // 조회수 증가
        if (typeof window !== 'undefined') {
          try {
            await post(`${API_ENDPOINTS.INSIGHTS}/${id}/increment-view`);
          } catch (err) { }
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Navigation va prev/next ni yuklash
  const fetchNavigationData = useCallback(async () => {
    if (!id || !insight) return;

    // IMPORTANT: Reset prev/next to null first to ensure proper state
    setPrevInsight(null);
    setNextInsight(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      const sub = urlParams.get('sub');
      const search = urlParams.get('search');

      console.log('[fetchNavigationData] URL params - category:', category, 'sub:', sub, 'search:', search);

      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '1000');

      if (insight?.category?.id) {
        params.append('categoryId', String(insight.category.id));
      }

      // Only add subcategoryId if sub is not "0" (which means "all")
      if (sub && sub !== '0') {
        params.append('subcategoryId', sub);
      }

      if (search) {
        params.append('search', search);
      }

      let memberType = null;
      let isApproved = null;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            memberType = user.memberType || null;
            if (memberType === 'INSURANCE') {
              isApproved = user.isApproved || null;
            }
          } catch (e) { }
        }
      }

      if (memberType) {
        params.append('memberType', memberType);
      } else {
        params.append('memberType', 'null');
      }

      if (isApproved !== null) {
        params.append('isApproved', String(isApproved));
      }

      console.log('[fetchNavigationData] Fetching with params:', params.toString());

      const navResponse = await get<{ items: InsightDetail[]; total: number }>(
        `${API_ENDPOINTS.INSIGHTS}?${params.toString()}`
      );

      if (navResponse.data && navResponse.data.items) {
        const items = navResponse.data.items;
        const currentIndex = items.findIndex(item => item.id === Number(id));

        console.log('[fetchNavigationData] Found', items.length, 'items, current index:', currentIndex);

        if (currentIndex >= 0) {
          // Set prev only if not first item
          if (currentIndex > 0) {
            setPrevInsight({
              id: items[currentIndex - 1].id,
              title: items[currentIndex - 1].title
            });
            console.log('[fetchNavigationData] Set prevInsight:', items[currentIndex - 1].title);
          } else {
            console.log('[fetchNavigationData] No previous item (first in list)');
          }

          // Set next only if not last item
          if (currentIndex < items.length - 1) {
            setNextInsight({
              id: items[currentIndex + 1].id,
              title: items[currentIndex + 1].title
            });
            console.log('[fetchNavigationData] Set nextInsight:', items[currentIndex + 1].title);
          } else {
            console.log('[fetchNavigationData] No next item (last in list)');
          }
        } else {
          console.log('[fetchNavigationData] Current item not found in list');
        }
      }
    } catch (err) {
      console.error('[fetchNavigationData] Error:', err);
    }
  }, [id, insight]);

  // Asosiy data yuklash
  useEffect(() => {
    if (id) {
      fetchInsightDetail();
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);

      if (token) {
        fetchCurrentUser();
      }
    }
  }, [id, fetchInsightDetail]);

  // Navigation data yuklash
  useEffect(() => {
    if (insight) {
      fetchNavigationData();
    }
  }, [insight, fetchNavigationData]);

  const fetchCurrentUser = async (): Promise<{ id?: number; name?: string; loginId?: string } | null> => {
    try {
      const response = await get<{ id: number; name: string; loginId: string }>(
        API_ENDPOINTS.AUTH.ME
      );

      if (response.data) {
        setCurrentUser(response.data);
        return response.data;
      } else {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const userInfo = { id: user.id, name: user.name, loginId: user.loginId };
            setCurrentUser(userInfo);
            return userInfo;
          } catch (e) {
            return null;
          }
        }
        return null;
      }
    } catch (err) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userInfo = { id: user.id, name: user.name, loginId: user.loginId };
          setCurrentUser(userInfo);
          return userInfo;
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  };

  const fetchComments = async (user?: { id?: number; name?: string; loginId?: string } | null) => {
    if (!id) return;

    const userToCompare = user !== undefined ? user : currentUser;

    try {
      const response = await get<CommentsResponse>(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments`
      );

      if (response.data) {
        const commentsWithIsMine = (response.data.items || []).map((comment) => {
          if (comment.isMine === true) {
            return comment;
          }

          if (userToCompare && userToCompare.id) {
            let isMyComment = false;

            if (comment.member?.id) {
              isMyComment = comment.member.id === userToCompare.id;
            }

            if (!isMyComment && comment.memberId) {
              isMyComment = comment.memberId === userToCompare.id;
            }

            if (!isMyComment && (comment.authorId || comment.userId)) {
              isMyComment = (comment.authorId === userToCompare.id) ||
                (comment.userId === userToCompare.id);
            }

            if (!isMyComment && comment.authorName && (userToCompare.name || userToCompare.loginId)) {
              isMyComment = comment.authorName === userToCompare.name ||
                comment.authorName === userToCompare.loginId;
            }

            return { ...comment, isMine: isMyComment };
          }

          return { ...comment, isMine: false };
        });

        setComments(commentsWithIsMine);
        setCommentTotal(response.data.total || 0);
      }
    } catch (err) { }
  };

  const handleBackToList = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};

    const category = urlParams.get('category');
    const sub = urlParams.get('sub');
    const search = urlParams.get('search');

    // Always include category
    if (category) {
      query.category = category;
    } else if (insight?.category?.id) {
      query.category = String(insight.category.id);
    }

    // Always include sub parameter - preserve from URL or default to "0" (all)
    if (sub !== null && sub !== undefined) {
      query.sub = sub;
    } else if (insight?.subcategory?.id !== undefined) {
      query.sub = String(insight.subcategory.id);
    } else {
      query.sub = '0'; // Default to "all" if no subcategory specified
    }

    // Include search if exists
    if (search) {
      query.search = search;
    }

    console.log('[handleBackToList] Navigating back with query:', query);

    router.push({
      pathname: '/insights',
      query: query
    });
  }, [router, insight]);

  const handlePrevClick = useCallback(() => {
    if (!prevInsight) {
      // No previous item - do nothing (UI should show "이전 글이 없습니다")
      console.log('[handlePrevClick] No previous insight available');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};

    const category = urlParams.get('category');
    const sub = urlParams.get('sub');
    const search = urlParams.get('search');

    if (category) {
      query.category = category;
    }

    // Always include sub - default to "0" if not present
    query.sub = sub !== null && sub !== undefined ? sub : '0';

    if (search) {
      query.search = search;
    }

    console.log('[handlePrevClick] Navigating to prev with query:', query);

    router.push({
      pathname: `/insights/${prevInsight.id}`,
      query: query
    });
  }, [prevInsight, router]);

  const handleNextClick = useCallback(() => {
    if (!nextInsight) {
      // No next item - do nothing (UI should show "다음 글이 없습니다")
      console.log('[handleNextClick] No next insight available');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};

    const category = urlParams.get('category');
    const sub = urlParams.get('sub');
    const search = urlParams.get('search');

    if (category) {
      query.category = category;
    }

    // Always include sub - default to "0" if not present
    query.sub = sub !== null && sub !== undefined ? sub : '0';

    if (search) {
      query.search = search;
    }

    console.log('[handleNextClick] Navigating to next with query:', query);

    router.push({
      pathname: `/insights/${nextInsight.id}`,
      query: query
    });
  }, [nextInsight, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
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
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          alert('링크가 클립보드에 복사되었습니다.');
        } catch (clipboardError) { }
      }
    }
  };

  const handleDownload = async (attachmentId: number, fileName: string) => {
    try {
      const headers: HeadersInit = {};
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const downloadUrl = `${API_BASE_URL}/attachments/${attachmentId}/download`;
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const contentDisposition = response.headers.get('Content-Disposition');
      let finalFileName = fileName;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          finalFileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("파일 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentText.trim() || isSubmittingComment) return;

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

        const newCommentWithIsMine: Comment = {
          ...newComment,
          isMine: true,
        };

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
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!id || !confirm('댓글을 삭제하시겠습니까?')) return;

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await del(
        `${API_ENDPOINTS.INSIGHTS}/${id}/comments/${commentId}`
      );

      if (!response.error) {
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
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReportComment = async (commentId: number) => {
    if (!id || !confirm('이 댓글을 신고하시겠습니까?')) return;

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
      alert('댓글 신고 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true} />
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
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true} />
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
    <>
      <SEO
        pageTitle={insight.title}
        menuName="인사이트"
        description={insight.content?.replace(/<[^>]*>/g, '').substring(0, 160) || '인사이트 상세 페이지입니다.'}
      />
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} isFixed={true} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div className={styles.floatingButtons}>
          <FloatingButton
            variant="consult"
            label="상담 신청하기"
            onClick={() => router.push('/consultation/apply')}
          />
        </div>

        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.headerSection}>
              <div className={styles.titleWrapper}>
                <div className={styles.category}>{insight.subMinorCategory ? insight.subMinorCategory.name : '카테고리 명'}</div>
                <h1 className={styles.title}>{insight.title}</h1>
              </div>
              <div className={styles.meta}>
                <div className={styles.metaLeft}>
                  <span className={styles.author}>{insight.authorName ? insight.authorName : "작성자"}</span>
                  <span className={styles.divider}></span>
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

            {insight.files && insight.files.length > 0 && (
              <div className={styles.attachmentsSection}>
                <h2 className={styles.attachmentsTitle}>첨부파일</h2>
                <div className={styles.attachmentsList}>
                  {insight.files && insight.files.map((file, index) => (
                    <div key={file.id} className={styles.attachmentItem}>
                      <div className={styles.attachmentLeft}>
                        <div className={styles.attachmentLabel}>{index + 1}</div>
                        <div className={styles.attachmentInfo}>
                          <Icon type="document" size={24} className={styles.attachmentIcon} />
                          <span className={styles.attachmentName} onClick={() => {
                            const fileName = file.fileName || file.url.split('/').pop() || '첨부 파일.pdf';
                            handleDownload(file.id, fileName);
                          }} >
                            {file.fileName || file.url.split('/').pop() || '첨부 파일.pdf'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.downloadButton}
                        onClick={() => {
                          const fileName = file.fileName || file.url.split('/').pop() || '첨부 파일.pdf';
                          handleDownload(file.id, fileName);
                        }}
                      >
                        <span className={styles.downloadButtonText}>다운로드</span>
                        <Icon type="download-white" size={20} className={styles.downloadIcon} />
                      </button>
                    </div>
                  ))}
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
                <div 
                  className={`${styles.navItem} ${!prevInsight ? styles.navItemDisabled : ''}`} 
                  onClick={prevInsight ? handlePrevClick : undefined}
                  style={{ cursor: prevInsight ? 'pointer' : 'default' }}
                >
                  {prevInsight ? (
                    <>
                      <Icon type="arrow-left-gray" size={24} className={styles.navIcon} />
                      <span className={styles.navLabel}>이전 글</span>
                      <span className={styles.navTitle}>{prevInsight.title}</span>
                    </>
                  ) : (
                    <>
                      <Icon type="arrow-left-gray" size={24} className={styles.navIcon} />
                      <span className={styles.navEmpty}>이전 글이 없습니다</span>
                    </>
                  )}
                </div>
                <div 
                  className={`${styles.navItem} ${styles.navItemNext} ${!nextInsight ? styles.navItemDisabled : ''}`} 
                  onClick={nextInsight ? handleNextClick : undefined}
                  style={{ cursor: nextInsight ? 'pointer' : 'default' }}
                >
                  {nextInsight ? (
                    <>
                      <span className={styles.navLabel}>다음 글</span>
                      <span className={styles.navTitle}>{nextInsight.title}</span>
                      <Icon type="arrow-right-gray" size={24} className={styles.navIcon} />
                    </>
                  ) : (
                    <>
                      <span className={styles.navEmpty}>다음 글이 없습니다</span>
                      <Icon type="arrow-right-gray" size={24} className={styles.navIcon} />
                    </>
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
    </>
  );
};

export default InsightDetailPage;