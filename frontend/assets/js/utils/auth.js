export const getToken   = ()    => localStorage.getItem('token');
export const getUser    = ()    => JSON.parse(localStorage.getItem('user') || 'null');
export const setSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user',  JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const isLoggedIn  = ()   => !!getToken();
const getPagePrefix = () => {
  const isLiveServer = window.location.port === '5500';
  return isLiveServer ? '/frontend' : '';
};

export const logout = () => {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    clearSession();
    const prefix = getPagePrefix();
    window.location.href = `${window.location.origin}${prefix}/pages/auth/login.html`;
  }
};

export const initLogout = () => {
  const btn = document.getElementById('logout-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
};

export const redirectIfNotLoggedIn = () => {
  if (!isLoggedIn()) {
    const prefix = getPagePrefix();
    window.location.href = `${window.location.origin}${prefix}/pages/auth/login.html`;
  }
};
export const redirectIfNotRole = (role) => {
  const user = getUser();
  if (!user || user.role !== role) {
    const prefix = getPagePrefix();
    window.location.href = `${window.location.origin}${prefix}/pages/auth/login.html`;
  }
};
