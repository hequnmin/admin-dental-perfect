import _ from 'lodash';
import request, { requestParams2Url } from '../utils/request';

export async function getSms(params) {
  const url = requestParams2Url(params);
  return request(`/api/classes/Sms${url}`, {
    method: 'GET',
  });
}

export async function postSms(params) {
  return request('/api/classes/Sms', {
    method: 'POST',
    body: params,
  });
}

export async function putSms(params) {
  const param = _.clone(params);
  const { objectId } = param;
  delete param.objectId;
  return request(`/api/classes/Sms/${objectId}`, {
    method: 'PUT',
    body: param,
  });
}

export async function deleteSms(params) {
  return request(`/api/classes/Sms/${params.objectId}`, {
    method: 'DELETE',
  });
}

export async function postSmsSend(params) {
  return request('/api/functions/SmsSend', {
    method: 'POST',
    body: params,
  });
}
