import {routerRedux} from 'dva/router';

async function handleErr(e, dispatch) {
    try{
      let status = (e.response) ? e.response.status : 0;
      let message = e.message || '服务器错误';
        
      // 根据 status 渲染不同的页面
      if (status && status === 401) {
        dispatch(
          routerRedux.push(`/error?status=${status}&message=${message}`)
        );
      }

      if (status === 403) {
        
      }
      if (status === 404) {
        
      }
      if (status === 500) {

      }
    }catch(e){
      console.log(e.message);
    }
    
}

  export default handleErr;