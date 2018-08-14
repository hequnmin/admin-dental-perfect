import { message } from 'antd';
import { getSms, postSms, putSms, deleteSms, postSmsSend } from '../services/sms';

export default {
  namespace: 'sms',

  state: {
    smses: {
      results: [],
    },
    sent: {
      results: [],
    },
  },

  effects: {
    // Sms
    *fetchSms({ payload }, { call, put }) {
      const response = yield call(getSms, payload);
      yield put({ type: 'querySms', payload: response });
    },
    *storeSms({ payload }, { call, put }) {
      const response = yield call(postSms, payload);
      if (response.error) {
        message.error(`保存失败！${response.error}`, 5);
      } else {
        yield put({ type: 'appendSms', payload: { ...payload, ...response } });
        // message.success('保存成功！', 3);
      }
    },
    *coverSms({ payload }, { call, put }) {
      const response = yield call(putSms, payload);
      if (response.error) {
        message.error(`保存失败！${response.error}`, 5);
      } else {
        yield put({ type: 'resetSms', payload: { ...payload, ...response } });
        message.success('保存成功！', 3);
      }
    },
    *removeSms({ payload }, { call, put }) {
      const response = yield call(deleteSms, payload);
      if (response.error) {
        message.error(`删除失败！${response.error}`, 5);
      } else {
        yield put({ type: 'clearSms', payload: { ...payload } });
        message.success('删除成功！', 3);
      }
    },

    *storeSmsSend({ payload }, { call, put }) {
      const res = yield call(postSmsSend, payload);
      if (res.error) {
        message.error(`保存失败！${res.error}`, 5);
      } else {
        yield put({ type: 'appendSmsSend', payload: { ...payload, ...res } });
        message.success('短信发送成功！', 3);
      }
    },
  },

  reducers: {
    // Sms:
    querySms(state, action) {
      return {
        ...state,
        smses: action.payload,
      };
    },
    appendSms(state, action) {
      return ({
        ...state,
        smses: {
          results: state.smses.results.concat(action.payload),
        },
      });
    },
    resetSms(state, action) {
      return ({
        ...state,
        smses: {
          results: state.smses.results.map((item) => {
            if (item.objectId === action.payload.objectId) {
              return { ...item, ...action.payload };
            } else {
              return item;
            }
          }),
        },
      });
    },
    clearSms(state, action) {
      return ({
        ...state,
        smses: {
          results: state.sms.results.filter(item => item.objectId !== action.payload.objectId),
        },
      });
    },

    // Sms Sent
    appendSmsSend(state, action) {
      return ({
        ...state,
        sent: {
          results: state.sent.results.concat(action.payload),
        },
      });
    },
  },
};

