import request from '../utils/request';


export function fetch({id}){
	return request(`/api/user/getUserInfo.json?id=${id}`);
}

export function remove(id){
	return request(`/api/user/${id}`,{
		method: 'DELETE',
	});
}

export function upload(values){
	return request(`/api/user/uploadHeadshot.json`,{
		method: 'POST',
		body:JSON.stringify(values),
	});
}

export function patch(id, values){
	return request(`/api/user/updateUserInfo.json`,{
		method: 'PATCH',
		body: JSON.stringify(values),
	});
}

export function create(values){
	return request('/api/user/signUp.json',{
		method:'POST',
		body: JSON.stringify(values),
	});
}

export function login(value){
	return request('/api/user/signIn.json',{
		method:'POST',
		body: JSON.stringify(value),
	})

}