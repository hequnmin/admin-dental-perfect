// 持久化或会话的数据缓存
export function setAutoLogin(auto) {
  return localStorage.setItem('autoLogin', auto ? '1' : '0');
}

export function getAutoLogin() {
  return (localStorage.getItem('autoLogin') === '1');
}

export function getSessionToken() {
  let token = localStorage.getItem('token');
  if (!token) {
    token = sessionStorage.getItem('token');
  }
  return token;
}

export function setSessionToken(token, autoLogin) {
  if (token) {
    if (autoLogin) {
      // 自动登录token存储localStorage持久化缓存
      sessionStorage.removeItem('token');
      return localStorage.setItem('token', token);
    } else {
      // 非自动登录token存储sessionStorage会话缓存
      localStorage.removeItem('token');
      return sessionStorage.setItem('token', token);
    }
  } else {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  }
}

export function setLogged(logged) {
  return sessionStorage.setItem('logged', logged ? '1' : '0');
}

export function getLogged() {
  const logged = sessionStorage.getItem('logged');
  return (logged === '1');
}

export function setCurrentUser(user) {
  return localStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
