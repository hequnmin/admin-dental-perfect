/* eslint-disable no-unused-vars,prefer-destructuring,no-param-reassign */
import { stringify } from 'qs';
import _ from 'lodash';
import request, { requestParams2Url } from '../utils/request';
import { getSessionToken } from '../utils/storage';

export async function getUsers(params) {
  return request(`/api/users${requestParams2Url(params)}`, {
    method: 'GET',
  });
}

export async function getUser(params) {
  return request(`/api/users?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function postUser(params) {
  return request('/api/users', {
    method: 'POST',
    body: params,
  });
}

export async function putUser(params) {
  // const token = getSessionToken();
  const param = _.clone(params);
  const objectId = param.objectId;
  delete param.objectId;
  return request(`/api/users/${objectId}`, {
    method: 'PUT',
    // headers: { 'X-Parse-Session-Token': token },
    body: param,
  });
}

export async function getLogin(params) {
  return request(`/api/login?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function getFunctionClientip() {
  return request('/api/functions/clientip', {
    method: 'POST',
  });
}

export async function getUserMe() {
  const token = getSessionToken();
  return request('/api/users/me', {
    method: 'GET',
    headers: { 'X-Parse-Session-Token': token },
  });
}

export async function postRequestPasswordReset(params) {
  return request('/api/requestPasswordReset', {
    method: 'POST',
    body: params,
  });
}

export async function getVerifyEmail(params) {
  return request(`/mail/verify_email${params}`, {
    method: 'GET',
  });
}

export async function getUserAuth(params) {
  return request(`/api/classes/UserAuth?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function postUserAuth(params) {
  // if (params.tags !== undefined) {
  //   const tag = params.tags.join(',');
  //   params.values.tags = tag;
  // }
  if (params.pointerUser !== undefined) {
    params.values.pointerUser = params.pointerUser;
  }
  return request('/api/classes/UserAuth', {
    method: 'POST',
    body: params.values,
  });
}

export async function putUserAuth(params) {
  const editid = params.objectId;
  // if (params.tags !== undefined) {
  //   const tag = params.tags.join(',');
  //   params.values.tags = tag;
  // }
  return request(`/api/classes/UserAuth/${editid}`, {
    method: 'PUT',
    body: params.values,
  });
}


export async function getAddress(params) {
  return request(`/api/classes/Address${requestParams2Url(params)}`, {
    method: 'GET',
  });
}

export async function getFunctionSmsSend() {
  return request('/api/functions/SmsSend', {
    method: 'POST',
  });
}

export async function postSmsRequestResetPassword(params) {
  return request('/api/functions/SmsRequestResetPassword', {
    method: 'POST',
    body: params,
  });
}

export async function postSmsAcceptResetPassword(params) {
  return request('/api/functions/SmsAcceptResetPassword', {
    method: 'POST',
    body: params,
  });
}

// export async function getRoles(params) {
//   return request(`/api/roles${requestParams2Url(params)}`, {
//     method: 'GET',
//   });
// }
export async function getRoles(params) {
  const newParams = { ...params, classname: '_Role', related: 'users,roles' };
  return request(`/api/functions/Query${requestParams2Url(newParams)}`, {
    method: 'POST',
  });
}

export async function getRole(params) {
  const url = requestParams2Url(params);
  return request(`/api/classes/Role${url}`, {
    method: 'GET',
  });
}

export async function getRoleUsers(params) {
  const url = requestParams2Url(params);
  return request(`/api/classes/RoleUser${url}`, {
    method: 'GET',
  });
}

export async function postRole(params) {
  return request('/api/classes/Role', {
    method: 'POST',
    body: params,
  });
}
