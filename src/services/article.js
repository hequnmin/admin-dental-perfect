import _ from 'lodash';
import request, { requestParams2Url } from '../utils/request';

export async function getArticles(params) {
  const url = requestParams2Url(params);
  return request(`/api/classes/Article${url}`, {
    method: 'GET',
  });
}

export async function getArticle(params) {
  const { objectId } = params;
  return request(`/api/classes/Article/${objectId}`, {
    method: 'GET',
  });
}

export async function postArticle(params) {
  return request('/api/classes/Article', {
    method: 'POST',
    body: params,
  });
}

export async function putArticle(params) {
  const param = _.clone(params);
  const { objectId } = param;
  delete param.objectId;
  return request(`/api/classes/Article/${objectId}`, {
    method: 'PUT',
    body: param,
  });
}
