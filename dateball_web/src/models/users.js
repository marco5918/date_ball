import queryString from 'query-string';
import * as usersService from '../services/users';


export default {
	namespace: 'me',
	state:{
		item:null,
	},

	subscriptions: {
		setup({dispatch, history}){
			return history.listen(({pathname, search})=>{
				console.log('pathname=',pathname);
				console.log('search:',search);
				const id = queryString.parse(search);
				console.log('id:',id);
				if(pathname === '/me'){
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
	},
	reducers:{
		save(state,{payload:{data:item}}){
			return {...state, item};
		},
		save_login(state,{payload:{data:item}}){
			return {...state, item}
		},
	}
}