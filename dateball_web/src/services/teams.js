import request from '../utils/request';


export function fetch_team_list({id}){
	return request(`/api/team/getTeamList.json?meid=${id}`);
}

export function fetch_player_list({id}){
    return request(`/api/team/getPlayerList.json?id=${id}`);
}

export function remove_team(id){
	return request(`/api/team/removeTeam.json?id=${id}`,{
		method: 'DELETE',
	});
}

export function join_team(id){
	return request(`/api/team/joinTeam.json?meid=${id}`,{
		method: 'POST',
	});
}

export function out_team(id){
	return request(`/api/team/outTeam.json?playerid=${id}`,{
		method: 'POST',
	});
}

export function upload(values){
	return request(`/api/team/uploadTeamLogo.json`,{
		method: 'POST',
		body:JSON.stringify(values),
	});
}

export function patch_team(id, values){
	return request(`/api/team/updateTeamInfo.json`,{
		method: 'PATCH',
		body: JSON.stringify(values),
	});
}

export function create_team(values){
	return request('/api/team/createTeam.json',{
		method:'POST',
		body: JSON.stringify(values),
	});
}
