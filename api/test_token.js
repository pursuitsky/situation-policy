let { loginToken, 
    verifyToken, 
    analysisToken,
    loginrefreshToken,
    RefreshToken } = require('./jwt_token')

let { AESEncrypt, AESDecrypt } = require('./crypto')

let data = {
    account: 'wym',
    password: '123'
}



//对密码进行加密
let encrypted = AESEncrypt(data.password)
let decrypted = AESDecrypt(encrypted)
console.log(encrypted)
console.log(decrypted)
data.password = encrypted


//生成access_token
const access_token = loginToken(data, expires = 60 * 10 )
console.log(access_token)

//生成refresh_token
const refresh_token = loginrefreshToken(data)
console.log(refresh_token)


setTimeout(() => {
    let { isExpired } = analysisToken(refresh_token) 
    if (!isExpired) {
        let access_isExpired = analysisToken(access_token).isExpired
        let { data } = analysisToken(access_token)
        if (access_isExpired) {
           let new_token = RefreshToken(data, expires = 60 * 10)
           console.log('新的token：', new_token)
           console.log(verifyToken(new_token))
        } else {
            console.log(verifyToken(access_token))
            console.log('token未过期')
        }
    } else {
        console.log('refresh_token已经过期，请求重新登录')
    }
}, 2000)

