import { routerRedux } from 'dva/router';
import { Message } from 'antd';
import { getLogin, putUser, getFunctionClientip } from '../services/account';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getAutoLogin, setCurrentUser, setLogged, setSessionToken } from '../utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    logged: false,
    currentUser: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(getLogin, payload);
      // Login successfully
      if (response.error === undefined) {
        if (response.sessionToken !== undefined) {
          yield put({
            type: 'changeLoginStatus',
            payload: { ...response, currentAuthority: 'admin' },
          });
          const autoLogin = getAutoLogin();
          setSessionToken(response.sessionToken, autoLogin);
          setCurrentUser({
            objectId: response.objectId,
            username: response.username,
            email: response.email,
            mobile: response.mobile,
          });
          setLogged(true);

          reloadAuthorized();
          const ip = yield call(getFunctionClientip);
          const dataTime = new Date().toISOString();
          const params = {
            objectId: response.objectId,
            loginIp: ip.result,
            loginDatetime: {
              __type: 'Date',
              iso: dataTime,
            },
          };
          yield call(putUser, params);
          yield put(routerRedux.push('/'));
          // } else {
          //   Message.error('登录失败！帐号未验证！', 5);
          // }
        } else {
          setLogged(false);
          Message.error('登录失败！无法获取Token！', 5);
        }
      } else {
        setLogged(false);
        Message.error(`登录失败！${response.error}`, 5);
      }
    },
    *logout(_, { put, select }) {
      try {
        setLogged(false);
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/account/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
