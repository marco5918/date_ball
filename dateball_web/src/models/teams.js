import queryString from 'query-string';
import * as teamsService from '../services/teams';
import {routerRedux} from 'dva/router';

export default {
	namespace: 'team',
	state:{
		item:null,
	},

	subscriptions: {
		setup({dispatch, history}){
			return history.listen(({pathname, search})=>{
				console.log('pathname=',pathname);
				console.log('search:',search);
				const search_value = queryString.parse(search);
				console.log('search_value:',search_value);
				if(pathname === '/team'){
					const id = {id:localStorage.getItem('data_ball_id')}
					dispatch({
						type: 'fetch_team_list',
						payload:id
					});
				}
			});
		},
	},

	effects:{
		*fetch_team_list({payload:id}, {call, put}){
			const {data, headers} = yield call(teamsService.fetch_team_list, id);
			yield put(
				{
					type: 'save', 
					payload:{
						data,
						headers
					},
				});
		},
		*reload_team_list(action, {put, select}){
			const id = yield select(state=>state.team.item.data.team.id);
			yield put({type: 'fetch_team_list', payload:{id}});
		},
		*create_team({payload: values},{call, put}){
			yield call(teamsService.create_team, values);
			yield put({type: 'reload_team_list'});
		},
		*remove_team({payload: id}, {call, put}){
			yield call(teamsService.remove_team, id);
			yield put({type:'reload_team_list'});
		},
		*patch_team({payload:{id, values}},{call,put}){
			yield call(teamsService.patch_team, id, values);
			yield put({type: 'reload_team_list'});
        },
        *join_team({payload:{id, values}},{call,put}){
			yield call(teamsService.join_team, id, values);
			yield put({type: 'reload_team_list'});
        },
        *out_team({payload:{id, values}},{call,put}){
			yield call(teamsService.out_team, id, values);
			yield put({type: 'reload_team_list'});
        },
		*upload({payload:{update_value}},{call,put}){
			const {data} = yield call(teamsService.upload, update_value);
			const id = update_value.id;
			const values = {
				id:id,
				hobby_id:update_value.hobby_id,
				[update_value.form_key]:data.success?data.data.pictureUrl:'',
			};

			yield put(
				{
					type: 'patch_team',
					payload:{id, values},
				});
		},
	},
	reducers:{
		save(state,{payload:{data:item, headers}}){
			return {...state, item, headers};
		},
	}
}