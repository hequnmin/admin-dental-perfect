import request, { requestParams2Url } from '../utils/request';

export async function getArticle(params) {
  const url = requestParams2Url(params);
  return request(`/api/classes/Article${url}`, {
    method: 'GET',
  });
}

export async function postArticle(params) {
  return request('/api/classes/Article', {
    method: 'POST',
    body: params,
  });
}
