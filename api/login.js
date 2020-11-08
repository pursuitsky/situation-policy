var express = require('express');
var app = express();
var connection = require('./mysql')
var jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')

let { loginToken, 
    verifyToken, 
    analysisToken,
    loginrefreshToken,
    RefreshToken } = require('./jwt_token')

let { AESEncrypt, AESDecrypt } = require('./crypto')


const promise = new Promise(function(resolve, reject) {
    connection.query('show tables', (err, results) => {
        if (results) {
            let data = JSON.parse(JSON.stringify(results))
            let list = []
            data.forEach(item => {
                for (let key in item) {
                    list.push(item[key])
                }
            })
            resolve(list)
        }
        if (err) {
            console.log(err)
            throw err
        }
    })
})

promise.then( res => {

const database = res.map((item) => {
    if (item.slice(-3) === '学生表') {
        return item
    }
}).filter((element) => {
    if (element != undefined) {
        return element
    }
}).sort((a, b) => {
    return a.slice(0,2) > b.slice(0,2)   //对学生表进行排序,按照递增方式排序,16,17,18,19
})

app.post('/login', function(req, res){

    let { account, password } = req.body

    if (account == "lixuebuadmin") {
        if (password == '123456') {
            let content = { account: account}
            let key = 'Token'
            let token = jwt.sign(content, key, {
                expiresIn: 60 * 60
            })
            // console.log(jwt.verify(token, key))
            res.send({
                status: 1,
                msg: '登录成功', 
                token: token, 
                account: '理学君', 
                identity: 'admin'
            })
        } else {
            res.send({
                msg: '密码错误',
                status: 0
            })
        }
    } else if (account == 'lixuebusuperadmin') { 
        if (password == 'superfairy') {
            let content = { account: account }
            let key = 'Token'
            let token = jwt.sign(content, key, {
                expiresIn: 60 * 60
            })
            res.send({
                status: 1,
                msg: '登录成功', 
                token: token, 
                account: '理学兔', 
                identity: 'superadmin'
            })
        } else {
            res.send({
                msg: '密码错误',
                status: 0
            })
        }
    } else {
        let sql = ''
        for (let i = 0; i < database.length; i++) {
            if (parseInt(database[i].slice(0,2)) == parseInt(account.slice(2,4))) {
                sql = `select 姓名,密码 from ${database[i]} where 学号=${account}`
            } else {
                // 如果输入的不是2017这样的学号就，默认查询17级学生表
                sql = `select 姓名,密码 from ${database[1]} where 学号=${account}`
            }
        }
        // console.log(sql)
        connection.query(sql, (err, results) => {
            if(err){
                console.log(err);
                throw err
            }
            let data = JSON.parse(JSON.stringify(results))
            // console.log(data)
            // let length = data.length
            if(data.length != 0) {
                let pass = data[0]['密码']
        
                if (password == pass) {

                    //设置access_token、refresh_token并对账号密码进行加密
                    let content = {
                        account: AESEncrypt(account),
                        password: AESEncrypt(pass)
                    }
                    const token = loginToken(content, expires = 60 * 10 )
                    // console.log(token)

                    const refresh_token = loginrefreshToken(content)
                    // console.log(refresh_token)  

                    console.log(verifyToken(refresh_token))    


                    let name = data[0]['姓名']

                    res.cookie('account',  account, {
                        // path: '/',
                        expires: new Date(Date.now() + 10000 * 60  * 24 * 1),
                        // domain: req.headers.origin, 
                        domain: 'http://127.0.0.1'
                        // httpOnly: false 
                    })

                    res.send({
                        status: 1, 
                        msg: '登录成功', 
                        token: token, 
                        account: account,
                        identity: 'student',
                        name: name,
                        refresh_token: refresh_token
                    })
                } else {
                    res.send({
                        msg: '登录失败，密码错误',
                        status: 0
                    })
                }
            } else{
                res.send({
                    status: 0,
                    msg: '登录失败，不存在该账号'
                })
            }
        })
    }
})

app.get('/logout', (req, res) => {
    // console.log(req.query)
    res.send({
        status: 'OK',
        code: 1,
        msg: '前端退出登录'
    })
})

//刷新access_token
app.post('/refreshtoken', (req, res) => {
    let access_token = req.headers.authorization // 获取headers里的authorization
    let { data } = analysisToken(access_token)
    token = RefreshToken(data, expires = 60 * 10)
    console.log('newtoken:', token)
    res.end(token) 
})

}).catch (err => {
    console.log(err)
})

module.exports = app