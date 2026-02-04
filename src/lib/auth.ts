export const clearAuth = () => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch {
    // ignore storage errors
  }
};

