import request from '../utils/request';


export function fetch_team_list({ id }) {
    return request(`/api/team/getTeamList.json?meid=${id}`);
}

export function fetch_player_list({ id }) {
    return request(`/api/team/getPlayerList.json?id=${id}`);
}

export function fetch_team_info({ team_id }) {
    return request(`/api/team/getTeamInfo.json?id=${team_id}`);
}

export function remove_team(id) {
    return request(`/api/team/removeTeam.json?id=${id}`, {
        method: 'DELETE',
    });
}

export function join_team(values) {
    return request(`/api/team/joinTeam.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function out_team(values) {
    return request(`/api/team/outTeam.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function reject_team(values) {
    return request(`/api/team/rejectTeam.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function upload(values) {
    return request(`/api/team/uploadTeamLogo.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function patch_team(id, values) {
    return request(`/api/team/updateTeamInfo.json`, {
        method: 'PATCH',
        body: JSON.stringify(values),
    });
}

export function create_team(values) {
    return request(`/api/team/createTeam.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function search_user(values) {
    return request(`/api/user/searchUser.json?search=${values.search}&teamId=${values.teamId}`);
}

export function invite_player(values) {
    return request(`/api/player/createPlayer.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}