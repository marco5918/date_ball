import queryString from 'query-string';
import * as pkService from '../services/pk';
import * as teamsService from '../services/teams';

import { routerRedux } from 'dva/router';

export default {
    namespace: 'pk',
    state: {
        item: null,
        search_item: null,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                console.log('pathname=', pathname);
                console.log('search:', search);
                const search_value = queryString.parse(search);
                console.log('search_value:', search_value);
                if (pathname === '/pk') {
                    const id = { id: localStorage.getItem('data_ball_id') }
                    dispatch({
                        type: 'fetch_pk_list',
                        payload: id
                    });
                }
            });
        },
    },

    effects: {
        * fetch_pk_list({ payload: id }, { call, put }) {
            const { data, headers } = yield call(pkService.fetch_pk_list, id);
            yield put({
                type: 'save',
                payload: {
                    data,
                    headers
                },
            });

        },
        * reload_pk_list(action, { put, select }) {
            const id = { id: localStorage.getItem('data_ball_id') };
            yield put({ type: 'fetch_pk_list', payload: id });
        },
        * fetch_pk_info({ payload: pk_id }, { call, put }) {
            const { data, headers } = yield call(pkService.fetch_pk_info, pk_id);
            yield put({
                type: 'save_pk_info',
                payload: {
                    data,
                    headers
                },
            });
        },

        * create_pk({ payload: { values } }, { call, put }) {
            const { data } = yield call(pkService.create_pk, values);
            if (data.success) {
                yield put({ type: 'reload_pk_list' });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * remove_pk({ payload: id }, { call, put }) {
            const { data } = yield call(pkService.remove_pk, id);
            if (data.success) {
                yield put({ type: 'reload_pk_list' });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * patch_pk({ payload: { pk_id, values } }, { call, put }) {
            const { data } = yield call(pkService.patch_pk, pk_id, values);
            if (data.success) {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
                yield put({ type: 'fetch_pk_info', payload: { pk_id } });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * do_reply({ payload: { values } }, { call, put }) {
            const { pk_id } = values;
            yield call(pkService.reply_pk, values);
            yield put({ type: 'fetch_pk_info', payload: { pk_id } });
        },

        * fetch_court_list({ payload: id }, { call, put }) {
            const { data, headers } = yield call(pkService.fetch_court_list, id);
            yield put({
                type: 'save_court_list',
                payload: {
                    data,
                    headers
                },
            });

        },

        * fetch_court_info({ payload: court_id }, { call, put }) {
            const { data, headers } = yield call(pkService.fetch_court_info, court_id);
            yield put({
                type: 'save_court_info',
                payload: {
                    data,
                    headers
                },
            });
        },

        * create_court({ payload: { values } }, { call, put }) {
            const { data } = yield call(pkService.create_court, values);
            if (data.success) {
                const { id } = data.court;
                yield put({ type: 'fetch_court_list', payload: id });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * remove_court({ payload: id }, { call, put }) {
            const { data } = yield call(pkService.remove_court, id);
            if (data.success) {
                const { id } = data.court;
                yield put({ type: 'fetch_court_list', payload: id });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * patch_court({ payload: { court_id, values } }, { call, put }) {
            const { data } = yield call(pkService.patch_court, court_id, values);
            if (data.success) {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
                yield put({ type: 'fetch_court_info', payload: { court_id } });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * upload({ payload: { update_value } }, { call, put }) {
            const { data } = yield call(pkService.upload, update_value);
            const id = update_value.court_id;
            const court_id = id;
            const values = {
                id: id,
                [update_value.form_key]: data.success ? data.data.pictureUrl : '',
            };

            yield put({
                type: 'patch_court',
                payload: { court_id, values },
            });
        },

        * search({ payload: { search_data } }, { call, put }) {
            const { data, headers } = yield call(teamsService.search_team, search_data);
            yield put({
                type: 'save_search',
                payload: {
                    data,
                    headers
                },
            });
        },
    },
    reducers: {
        save(state, { payload: { data: item, headers } }) {
            const error_info = null;
            return {...state, item, headers, error_info };
        },
        save_court_list(state, { payload: { data: item_court_list, headers } }) {
            const error_info = null;
            return {...state, item_court_list, headers, error_info };
        },
        save_pk_info(state, { payload: { data: item_pk_info, headers } }) {
            return {...state, item_pk_info, headers };
        },
        save_court_info(state, { payload: { data: item_court_info, headers } }) {
            return {...state, item_court_info, headers };
        },
        save_search(state, { payload: { data: search_item, headers } }) {
            return {...state, search_item, headers };
        },
        save_error(state, { payload: { data: error_info } }) {
            return {...state, error_info };
        },
    }
}