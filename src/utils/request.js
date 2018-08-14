import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { getSessionToken, getLogged, getCurrentUser } from './storage';
import { appId } from '../config';

const codeMessage = {
  101: '无效的用户名/密码',
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  // if (response.status >= 200 && response.status < 300) {
  if (response.status < 500) {
    return response;
  } else {
    // 网络或者服务器问题，注销用户重新登陆
    const { dispatch } = store;
    dispatch({ type: 'login/logout' });
  }

  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  notification.error({
    message: '网络请求错误或服务不可用，请重新登录！',
    description: `请求错误 ${response.status}`,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  // const requireSessionToken = (localStorage.logged === '1');
  const requireSessionToken = getLogged();
  if (newOptions.method === 'GET') {
    // GET请求带SessionToken，除/login、/users之外
    // const requireSessionToken = (url.indexOf('/login') < 0) && (url.indexOf('/users') < 0);
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Parse-Application-Id': appId,
      ...newOptions.headers,
    };
    if (requireSessionToken) {
      newOptions.headers = {
        ...newOptions.headers,
        // 'X-Parse-Session-Token': localStorage.token,
        'X-Parse-Session-Token': getSessionToken(),
      };
    }
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Parse-Application-Id': appId,
        ...newOptions.headers,
      };
      // const exemptSessionToken = (url.indexOf('/functions/SmsSend') > 0);
      if (requireSessionToken) {
        newOptions.headers = {
          ...newOptions.headers,
          // 'X-Parse-Session-Token': localStorage.token,
          'X-Parse-Session-Token': getSessionToken(),
        };
      }
      // 加入ACL管理
      if (newOptions.method === 'POST' && newOptions.body !== undefined && requireSessionToken) {
        const currentUser = getCurrentUser();
        const jsonACL = `{"*": {"read": true }, "${currentUser.objectId}": {"read": true, "write": true }}`;
        const ACL = JSON.parse(jsonACL);
        newOptions.body = {
          ...newOptions.body,
          ACL,
        };
      }
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'X-Parse-Application-Id': appId,
        // 'X-Parse-Session-Token': localStorage.token,
        'X-Parse-Session-Token': getSessionToken(),
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch((e) => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}

export function requestParams2Url(params) {
  let url = '';
  if (params === undefined) {
    return url;
  }
  if ('where' in params) {
    url += `${(url.length > 0 ? '&' : '')}where=${JSON.stringify(params.where)}`;
  }
  if ('include' in params) {
    url += `${(url.length > 0 ? '&' : '')}include=${params.include}`;
  }
  if ('count' in params) {
    url += `${(url.length > 0 ? '&' : '')}count=${params.count}`;
  }
  if ('limit' in params) {
    url += `${url.length > 0 ? '&' : ''}limit=${params.limit}`;
  }
  if ('skip' in params) {
    url += `${url.length > 0 ? '&' : ''}skip=${params.skip}`;
  }
  if ('order' in params) {
    url += `${url.length > 0 ? '&' : ''}order=${params.order}`;
  }
  if ('keys' in params) {
    url += `${url.length > 0 ? '&' : ''}keys=${params.keys}`;
  }
  if ('classname' in params) {
    url += `${url.length > 0 ? '&' : ''}classname=${params.classname}`;
  }
  if ('related' in params) {
    url += `${url.length > 0 ? '&' : ''}related=${params.related}`;
  }
  return url.length > 0 ? `?${url}` : url;
}
