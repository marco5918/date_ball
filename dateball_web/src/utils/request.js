import fetch from 'dva/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
async function request(url, options) {
  //options = {...options, credentials:'include'};
  console.log(localStorage.getItem('data_ball_expires'))
  let token = null;
  let expires = null;
  if(window.localStorage){
    token = localStorage.getItem('data_ball_token');
    expires = localStorage.getItem('data_ball_expires');
  }

  if(url.match('signIn.json') == null && url.match('signUp.json') == null){
    if(expires == null || expires <= Date.now()){
      let ret = {
        data:null,
        headers:{},
      }
      ret.data = null;
      ret.headers['x-access-token-expires'] = true;
      return ret;
    }
  }

  const response = await fetch(url, 
    {...options, headers:{'Content-Type':'application/json','x-access-token':token}});
  
  const res = checkStatus(response);
  if(res !== null){
    const data = await response.json();
    let ret = {
      data,
      headers:{},
    }

    ret.headers['x-access-token-expires'] = false;
    // if(response.headers.get('x-total-count')){
    //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
    // }
    console.log("request: ",ret);
    return ret;
  }

  return null;
}

export default request;
