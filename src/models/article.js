import qs from 'qs';
import { getArticles, getArticle, postArticle, putArticle } from '../services/article';

export default {
  namespace: 'article',

  state: {
    articles: {
      results: [],
      count: 0,
      page: 0,
      query: {
        limit: 10,
        skip: 0,
        count: true,
      },
    },
    article: undefined,
  },

  effects: {
    * trashArticle(_, { put }) {
      yield put({ type: 'emptyArticle' });
    },
    * fetchArticles({ payload }, { call, put }) {
      const response = yield call(getArticles, payload);
      yield put({ type: 'queryArticles', payload: { ...response, query: payload } });
    },
    * fetchArticle({ payload }, { call, put }) {
      const response = yield call(getArticle, payload);
      yield put({ type: 'queryArticle', payload: { ...response } });
    },
    * storeArticle({ payload }, { call }) {
      yield call(postArticle, payload);
      // const response = yield call(postArticle, payload);
      // if (!response.error) {
      //   yield put({type: 'appendArticle', payload: {...payload, ...response}});
      // }
    },
    * coverArticle({ payload }, { call, put }) {
      const response = yield call(putArticle, payload);
      yield put({ type: 'resetArticle', payload: { ...payload, ...response } });
    },
  },

  reducers: {
    emptyArticle(state) {
      return ({
        ...state,
        article: undefined,
      });
    },
    queryArticles(state, action) {
      return {
        ...state,
        articles: action.payload,
      };
    },
    queryArticle(state, action) {
      return {
        ...state,
        article: action.payload,
      };
    },
    appendArticle(state, action) {
      return ({
        ...state,
        article: {
          results: state.articles.results.concat(action.payload),
          count: state.data.count + 1,
        },
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        if (pathname === '/article/articles') {
          dispatch({ type: 'fetchArticles', payload: query });
        }
        if (pathname === '/article/article') {
          dispatch({ type: 'trashArticle' });
        }
        if (pathname.indexOf('/article/article/') >= 0) {
          const objectId = pathname.substring(pathname.lastIndexOf('/') + 1);
          dispatch({ type: 'fetchArticle', payload: { objectId } });
        }
      });
    },
  },
};
