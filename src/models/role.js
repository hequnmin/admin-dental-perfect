import { message } from 'antd';
import { getRoles, postRole } from '../services/account';

export default {
  namespace: 'role',

  state: {
    roles: {
      results: [],
    },
  },

  effects: {
    *fetchRoles({ payload }, { call, put }) {
      const response = yield call(getRoles, payload);
      yield put({ type: 'queryRoles', payload: response });
    },

    *storeRole({ payload }, { call, put }) {
      const response = yield call(postRole, payload);
      if (response.error) {
        message.error(`保存失败！${response.error}`, 5);
      } else {
        yield put({ type: 'appendRole', payload: { ...payload, ...response } });
        message.success('保存成功！', 3);
      }
    },
  },

  reducers: {
    queryRoles(state, action) {
      return {
        ...state,
        // roles: action.payload,
        roles: {
          results: action.payload.result, // ...functions/Query 接口响应为result
        },
      };
    },

    appendRole(state, action) {
      return ({
        ...state,
        roles: {
          results: state.role.results.concat(action.payload),
        },
      });
    },
  },
};
