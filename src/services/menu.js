import request, { requestParams2Url } from '../utils/request';

export async function getMenus(params) {
  // return request(`/api/classes/Menu${requestParams2Url(params)}`, {
  //   method: 'GET',
  // });
  return request(`/api/functions/Menu${requestParams2Url(params)}`, {
    method: 'POST',
  });
}
