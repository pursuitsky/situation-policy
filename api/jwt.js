// jwt生成的token 实现验证（已经可以验证）、过期处理以及token刷新
// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;
        this._id = null; // 用户自定义 存放userid
        this._date = null; // 过期时间
        this._creatDate = null; // 创建时间
    }
    // 重新生成 token
    refreshToken() {
        let data = this.data;
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, './pem/private_key.pem'));//私钥 可以自己生成
        let token = jwt.sign({
            data,
            exp: created + 60 * 30, // 过期时间 
            iat: created, // 创建时间
        }, cert, {algorithm: 'RS256'});
        return token;
    }
    //生成token
    generateToken(data) {
        if (data) {
            this.data = data;
        }
        let Data = this.data;
        let created = Math.floor(Date.now() / 1000);
        console.log(created)
        let cert = fs.readFileSync(path.join(__dirname, './pem/private_key.pem'));//私钥 可以自己生成
        let token = jwt.sign({
            Data,
            exp: created + 60 * 30, // 过期时间 30 分钟
            iat: created, // 创建时间
        }, cert, {algorithm: 'RS256'});
        return token;
    }

    // 校验token
    verifyToken(data) {
        if (data) {
            this.data = data;
        }
        let token = this.data;
        let cert = fs.readFileSync(path.join(__dirname, './pem/public_key.pem'));//公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
            // this._id = result.data;
            // this._date = result.exp;
            // this._creatDate = result.iat;
            let {exp = 0} = result
            let current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
                // res = result.data
            }
        } catch (e) {
            // res = 'err';
            console.log(e)
        }
        return res;
    }
}

const jt = new Jwt()
const Token = jt.generateToken({ data: '123'})
console.log(Token)
const res = jt.verifyToken(Token)
console.log(res)

module.exports = Jwt ;
//在 app.js中新增一个中间件拦截请求对token进行验证正确与否，是否过期，是否需要重新生成token，是否直接返回前端重新登录，这里边是怎样的一个过程以及实现token的刷新，失效处理的方法