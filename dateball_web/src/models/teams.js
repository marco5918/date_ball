import queryString from 'query-string';
import * as teamsService from '../services/teams';
import { routerRedux } from 'dva/router';

export default {
    namespace: 'team',
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
                if (pathname === '/team') {
                    const id = { id: localStorage.getItem('data_ball_id') }
                    dispatch({
                        type: 'fetch_team_list',
                        payload: id
                    });
                }
            });
        },
    },

    effects: {
        * fetch_team_list({ payload: id }, { call, put }) {
            const { data, headers } = yield call(teamsService.fetch_team_list, id);
            yield put({
                type: 'save',
                payload: {
                    data,
                    headers
                },
            });

        },
        * reload_team_list(action, { put, select }) {
            const id = { id: localStorage.getItem('data_ball_id') };
            yield put({ type: 'fetch_team_list', payload: id });
        },
        * fetch_team_info({ payload: team_id }, { call, put }) {
            const { data, headers } = yield call(teamsService.fetch_team_info, team_id);
            yield put({
                type: 'save_team_info',
                payload: {
                    data,
                    headers
                },
            });
        },

        * create_team({ payload: { values } }, { call, put }) {
            const { data } = yield call(teamsService.create_team, values);
            if (data.success) {
                yield put({ type: 'reload_team_list' });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * remove_team({ payload: id }, { call, put }) {
            const { data } = yield call(teamsService.remove_team, id);
            if (data.success) {
                yield put({ type: 'reload_team_list' });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * patch_team({ payload: { team_id, values } }, { call, put }) {
            const { data } = yield call(teamsService.patch_team, team_id, values);
            if (data.success) {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
                yield put({ type: 'fetch_team_info', payload: { team_id } });
            } else {
                yield put({
                    type: 'save_error',
                    payload: {
                        data
                    },
                });
            }
        },

        * invite_player({ payload: { values } }, { call, put }) {
            const { team_id } = values;
            yield call(teamsService.invite_player, values);
            yield put({ type: 'fetch_team_info', payload: { team_id } });
        },
        * join_team({ payload: { values } }, { call, put }) {
            yield call(teamsService.join_team, values);
            yield put({ type: 'reload_team_list' });
        },
        * out_team({ payload: { values } }, { call, put }) {
            yield call(teamsService.out_team, values);
            yield put({ type: 'reload_team_list' });
        },
        * reject_team({ payload: { values } }, { call, put }) {
            yield call(teamsService.reject_team, values);
            yield put({ type: 'reload_team_list' });
        },
        * upload({ payload: { update_value } }, { call, put }) {
            const { data } = yield call(teamsService.upload, update_value);
            const id = update_value.team_id;
            const team_id = id;
            const values = {
                id: id,
                [update_value.form_key]: data.success ? data.data.pictureUrl : '',
            };

            yield put({
                type: 'patch_team',
                payload: { team_id, values },
            });
        },
        * search({ payload: { search_data } }, { call, put }) {
            const { data, headers } = yield call(teamsService.search_user, search_data);
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
        save_team_info(state, { payload: { data: item_team_info, headers } }) {
            return {...state, item_team_info, headers };
        },
        save_search(state, { payload: { data: search_item, headers } }) {
            return {...state, search_item, headers };
        },
        save_error(state, { payload: { data: error_info } }) {
            return {...state, error_info };
        },
    }
}