const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')


//access_token生成
function loginToken(data, expires = 60 * 60) {
  const exp = Math.floor(Date.now() / 1000) + expires
  const cert = fs.readFileSync(path.join(__dirname, './pem/rsa_private_key.pem')) // 私钥，自动生成方法
  const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
  return token
}


//refresh_token生成
function loginrefreshToken(data) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7  //refresh_token设置七天后失效
  // const exp = Math.floor(Date.now() / 1000) + 1
  const cert = fs.readFileSync(path.join(__dirname, './pem/rsa_private_key.pem')) // 私钥，自动生成方法
  const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
  return token
}

//refresh_token刷新
function RefreshToken(access_token, expires = 60 * 60) {
  const data = access_token
  const exp = Math.floor(Date.now() / 1000) + expires
  const cert = fs.readFileSync(path.join(__dirname, './pem/rsa_private_key.pem')) // 私钥，自动生成方法
  const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
  return token
}


// 解密，验证
function verifyToken(token) {
  const cert = fs.readFileSync(path.join(__dirname, './pem/rsa_public_key.pem')) // 公钥，自动生成方法
  let res = ''
  try {
    // const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }, (err, decode) => {
    //     if (err) {
    //         switch (err.name) {
    //             case 'JsonWebTokenError':  //jwt错误
    //                 // res.status(403).send({ code: -1, msg: '无效的token' })
    //                 console.log('无效的token')
    //                 break;
    //             case 'TokenExpiredError':  //token超时时抛出
    //                 console.log('token过期')
    //                 // res.status(403).send({ code: -1, msg: 'token过期' })
    //                 break;
    //             case 'NotBeforeError':  //当前时间超出nbf的值时抛出该错误
    //                 console.log('当前时间超出声明的期限');
    //                 break;
    //         }
    //     }
    // }) || {}

    const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {}
    // console.log(result)
    const { exp } = result,
      current = Math.floor(Date.now() / 1000)
    if (current <= exp) {
        res = result.data || {}
    } 
  } catch (e) {
    console.log(e)
  }
  return res
}

//判断token是否过期
function analysisToken(token) {
    const decoded = jwt.decode(token, {complete: true})
    const { data, exp } = decoded.payload,
          current = Math.floor(Date.now() / 1000)
    let isExpired = false
    if (current > exp) {
      isExpired = true
      return { data, isExpired }
    }
    return { data, isExpired }
}

module.exports = {
    loginToken,
    verifyToken,
    analysisToken,
    loginrefreshToken,
    RefreshToken
}