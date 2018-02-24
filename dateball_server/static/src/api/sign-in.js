import Request from './../utils/request'

const signInApi = async (userInfo) => {
  console.log("into sing-in signInApi")
  let result = await Request.post({
    url:'/api/user/signIn.json',
    data: userInfo
  })
  return result
}

const signInFormApi =async (userInfo) => {
  userInfo.source = 'form'
  console.log("into sing-in signInForm")
  Request.form({
    url:'/api/user/signIn.json',
    data:userInfo,
  })
}

export {signInApi, signInFormApi}
