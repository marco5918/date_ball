import queryString from 'query-string';
import * as usersService from '../services/users';
import {routerRedux} from 'dva/router';

export default {
	namespace: 'me',
	state:{
		item:null,
		item_login:null,
		item_signup:null,
	},

	subscriptions: {
		setup({dispatch, history}){
			return history.listen(({pathname, search})=>{
				console.log('pathname=',pathname);
				console.log('search:',search);
				const search_value = queryString.parse(search);
				console.log('search_value:',search_value);
				if(pathname === '/me'){
					const id = {id:localStorage.getItem('data_ball_id')}
					dispatch({
						type: 'fetch',
						payload:id
					});
				}
			});
		},
	},

	effects:{
		*fetch({payload:id}, {call, put}){
			const {data, headers} = yield call(usersService.fetch, id);
			yield put(
				{
					type: 'save', 
					payload:{
						data,
						headers
					},
				});
		},
		*reload(action, {put, select}){
			const id = yield select(state=>state.me.item.data.me.id);
			yield put({type: 'fetch', payload:{id}});
		},
		*create({payload: values},{call, put}){
			yield call(usersService.create, values);
			yield put({type: 'reload'});
		},
		//delete是关键字
		*remove({payload: id}, {call, put}){
			yield call(usersService.remove, id);
			yield put({type:'reload'});
		},
		*patch({payload:{id, values}},{call,put}){
			yield call(usersService.patch, id, values);
			yield put({type: 'reload'});
		},
		*upload({payload:{update_value}},{call,put}){
			const {data} = yield call(usersService.upload, update_value);
			const id = update_value.id;
			const values = {
				id:id,
				hobby_id:update_value.hobby_id,
				[update_value.form_key]:data.success?data.data.pictureUrl:'',
			};

			yield put(
				{
					type: 'patch',
					payload:{id, values},
				});
		},
		*login({payload:{value}},{call,put}){
			const {data} = yield call(usersService.login, value);
			yield put({
				type: 'save_login',
				payload: {data},
			})
		},
		*signup({payload:{value}},{call,put}){
			const {data} = yield call(usersService.signup, value);
			yield put({
				type:'save_signup',
				payload: {data},
			})
		},
		*gotoLogin({payload:{value}},{call, put}){
			yield put(routerRedux.push('/login'));
		},
	},
	reducers:{
		save(state,{payload:{data:item, headers}}){
			return {...state, item, headers};
		},
		save_login(state,{payload:{data:item_login}}){
			let headers = null;
			return {...state, item_login, headers}
		},
		save_signup(state,{payload:{data:item_signup}}){
			let headers = null;
			return {...state, item_signup, headers}
		},
	}
}