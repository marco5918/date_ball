import request from '../utils/request';


export function fetch_pk_list({ id }) {
    return request(`/api/pk/getPkList.json?meid=${id}`);
}

export function fetch_court_list({ id }) {
    return request(`/api/court/getCourtList.json?meid=${id}`);
}

export function create_pk(values) {
    return request(`/api/pk/createPk.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function create_court(values) {
    return request(`/api/court/createCourt.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function patch_pk(id, values) {
    return request(`/api/pk/updatePk.json`, {
        method: 'PATCH',
        body: JSON.stringify(values),
    });
}

export function patch_court(id, values) {
    return request(`/api/court/updateCourt.json`, {
        method: 'PATCH',
        body: JSON.stringify(values),
    });
}

export function remove_pk(id) {
    return request(`/api/pk/removePk.json?id=${id}`, {
        method: 'DELETE',
    });
}

export function remove_court(id) {
    return request(`/api/court/removeCourt.json?id=${id}`, {
        method: 'DELETE',
    });
}

export function reply_pk(values) {
    return request(`/api/pk/replyPk.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}


export function upload(values) {
    return request(`/api/court/uploadCourtImg.json`, {
        method: 'POST',
        body: JSON.stringify(values),
    });
}