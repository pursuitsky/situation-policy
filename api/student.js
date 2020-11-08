var express = require('express');
var router = express.Router();
var url = require('url')
var db = require('./mysql')

let { loginToken, 
    verifyToken, 
    analysisToken,
    loginrefreshToken,
    RefreshToken } = require('./jwt_token')

let { AESEncrypt, AESDecrypt } = require('./crypto')



const promise = new Promise(function(resolve, reject) {
    db.query('show tables', (err, results) => {
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

promise.then(res => {
//打印数据库表名
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


//这里设置了token鉴权
//学生界面通过学号查询cardme信息
router.get('/information/:id', (req, res) => {
    let id = req.params.id
    let stutable = id.slice(2,4) + "级学生表"
    let sql = `SELECT 学号,姓名,总分,班级 FROM ${stutable} WHERE 学号=${id}`
    
    //验证token
    // console.log(req.headers)
    let access_token = req.headers.authorization // 获取headers里的authorization
    let refresh_token = req.headers.refreshtoken //获取heades里的refreshToken
    // console.log(refresh_token)
    let { data, isExpired } = analysisToken(access_token)
    //access_token过期，返回错误状态码，验证refresh_token
    // console.log(isExpired)
    if (access_token && refresh_token) {
        if (isExpired) {
            return res.status(401).send('access_token过期，请刷新数据')
        } else {
            //判断refresh_token是否过期
            let isExpiredRefresh = analysisToken(refresh_token).isExpired
            //如果refresh_token过期
            console.log(isExpiredRefresh)
            if (isExpiredRefresh) {
                return res.status(403).send('refresh_token过期，请重新登录')
            } else {
                //判断access_token，这里肯定是未过期
                let token = req.headers.authorization
                if (token) {
                    let { account, password } = verifyToken(token)
                    // account = AESDecrypt(account)
                    // password = AESDecrypt(password)
                    // console.log(account, password)

                    //这里可以使用redis进行保存access_token，如果access_token与redis服务器里面的
                    //token相同，可以判断登录状态，是否已经在其他地方登录过，登录是否过期
                    if (account && password) {
                        db.query(sql,(err,results)=>{
                            if(err){
                                console.log(err)
                                throw err
                            }
                            let data = JSON.parse(JSON.stringify(results))
                            let dataList = []
                            data.forEach(item => {
                                let obj = {}
                                for (let [key, value] of Object.entries(item)) {
                                    if (key == '学号') {
                                        obj.userid = value
                                    }
                                    if (key == '姓名') {
                                        obj.name = value
                                    }
                                    if (key == '班级') {
                                        obj.class = value
                                    }
                                    if (key == '总分') {
                                        obj.score = value
                                    }
                                }
                                dataList.push(obj)
                            })
                            // console.log(dataList)
                            res.send({
                                msg: '个人信息获取成功', 
                                data: dataList
                            })
                        })
                    }
                } else {
                    return res.status(402)
                }
            }
        }
    } else {
        return res.status(403).send('未登录，请重新登录')
    }
})

//点击参与按钮报名
router.post('/paticipate',function(req,res,next){

    let id = req.body.userId
    let activity = req.body.activity
    let name = req.body.name
    let activity_time = req.body.time
    let score = req.body.score
    let activitytime = activity_time + '_' + activity
    let remains = ''

    let sql = `SELECT 剩余名额 FROM 活动信息表 WHERE 名称='${activity}'and 日期='${activity_time}'`
    db.query(sql,(err,results)=>{
        if(err){
            console.log(err)
            throw err
        }
        remains = JSON.parse(JSON.stringify(results))[0]['剩余名额']
        console.log(remains)
        //活动还有名额
        if(remains > 0) {
            //需要先判断是否有当前记录没有就添加，有则不添加修改是否报名=1
            let sql_re = `select * from 活动记录表 where 学号='${id}' and 活动名称='${activity}' and 活动日期='${activity_time}' and 分数='${score}'`
            db.query(sql_re, (err, results) => {
                if (err) {
                    throw err
                }
                let res = JSON.parse(JSON.stringify(results))
                // console.log(res)
                if (res.length > 0) {
                    // console.log('记录表中有相关记录')
                    let sql_up = `update 活动记录表 set 是否报名='1' where 学号='${id}' and 活动名称='${activity}' and 活动日期='${activity_time}' and 分数='${score}'`
                    db.query(sql_up, (err, results) => {
                        if (err) throw err
                        // console.log(results)
                        // console.log('修改活动记录信息成功')
                    })
                } else {
                    let sql1 = "INSERT INTO 活动记录表 VALUES(?,?,?,?,?,?,?)"
                    // let sql1 = `INSERT INTO 活动记录表 VALUE ('${}','${}','${}','${}','${}','${}','${}')`
                    db.query(sql1, [id, name, activity, activity_time, "1", "0", score] ,(err,results) => {
                        if(err){
                            console.log(err);
                        }
                        // console.log(results)
                    })
                }
            })

            //修改活动信息表，把剩余名额减一
            remains = remains - 1
            let sql2 = `UPDATE 活动信息表 SET 剩余名额='${remains}' WHERE 名称='${activity}' and 日期='${activity_time}' `
            db.query(sql2,(err,result)=>{
                if(err){
                    console.log(err)
                }
                //可能有其他人同时提交报名，导致名额减少
                let sql3 = `SELECT 剩余名额 FROM 活动信息表 WHERE 名称='${activity}'and 日期='${activity_time}'`
                db.query(sql3,(err,results)=>{
                    if(err){
                        console.log(err)
                    }
                    remains = JSON.parse(JSON.stringify(results))[0]['剩余名额']

                    res.send({
                        msg: `${activity}报名成功`,
                        surplus: remains,
                        statue: 'success'
                    })
                })
            })
        } else{
            res.send({
                msg: '名额已满，报名失败',
                statue: 'fail'
            })
        }
    })   
})

// 有个问题就是用户登录的时候管理员突然删除正在监听的属性，就会出现错误
// 侦听活动报名信息剩余名额的变化
router.get('/remains', (req, res) => {
    let activity = req.query.activity
    let activity_time = req.query.time
    let score = req.query.score
    // console.log(activity, activity_time, score)
    let sql = `SELECT 剩余名额 FROM 活动信息表 WHERE 名称='${activity}'and 日期='${activity_time}' and 分数='${score}'`
    db.query(sql,(err, results)=>{
        if(err){
            console.log(err)
            throw err
        }
        // Cannot read property '剩余名额' of undefined
        let result = JSON.parse(JSON.stringify(results))
        if (result.length > 0) {
            let data = result[0]['剩余名额']
            res.send({
                surplus: data,
                msg: `${activity}剩余名额发送变化`
            }) 
        } else {
            res.send({
                msg: '活动不存在',
                surplus: '0'
            })
        }
    })
})

//学生界面获取所有可报名活动信息
router.get('/activity/information',function(req,res,next){
    let id = req.query.id
    // console.log(id)

    //只显示未结束报名的活动
    db.query(`SELECT 名称,日期,时间,地点,分数,剩余名额 FROM 活动信息表 WHERE 是否结束报名 = 0;`,(err,results)=>{
        if(err){
            // console.log(err)
            return err
        }

        //正在报名的活动
        let data = JSON.parse(JSON.stringify(results))
        // console.log(activity_signup)
        // console.log(data)
        let dataList = []
        let innerList = []

        data.forEach(item => {
            //对每一组数据进行变换
            let obj = {}
            let str1 = ''
            let str2 = ''
            for (let [key, value] of Object.entries(item)) {
                if (key == '名称') {
                    obj.activity = value
                }
                if (key == '日期') {
                    obj.year = value.slice(0,4)
                    str1 = value.slice(5)
                }
                if (key == '时间') {
                    str2 = value
                }
                if (key == '地点') {
                    obj.place = value
                }
                if (key == '分数') {
                    obj.add = value
                }
                if (key == '剩余名额') {
                    obj.surplus = value
                }
            }
            let time = str1 + '/ ' + str2
            obj.time = time
            // console.log(obj)
            let activityTime = obj.year + '-' + str1
            // console.log(activityTime)


            //选择某一学号的同学未报名的活动
            let sql = `select 是否报名 from 活动记录表 where 学号='${id}' and 活动名称='${obj.activity}' and 活动日期='${activityTime}'`
            // console.log(sql)

            //增加一个判断属性part，用来判断是否已经报名参加获取，遍历
            innerList.push(new Promise((resolve, reject) => {
                db.query(sql, (err, result) => {
                    if (err) {
                        throw err
                    }
                    let participate = JSON.parse(JSON.stringify(result))
                    // console.log(participate)
                    // console.log(participate.length)
                    //如果participate.length > 0表示活动记录表中存在当前学生活动报名记录，否则代表不存在学生活动记录
                    if (participate.length > 0) {
                        // console.log(participate[0]['是否报名'])
                        obj.part = participate[0]['是否报名']
                    } else {
                        obj.part = '0'
                    }
                    // console.log(obj)
                    resolve(obj)
                })
            }))
        })
        Promise.all(innerList).then(array => {
            // console.log('内：',array)
            dataList = array
            return res.send({
                data: dataList,
                msg: '获取活动报名信息成功'
            })
        })
    })
});

//获取已加分信息
router.post('/addScore',function(req,res,next){
    let stuid = req.body.userId
    let activity_added = []
    db.query(`SELECT 活动名称,活动日期 FROM 活动记录表 WHERE 是否加分 = 1 and 学号=${stuid};`,(err,results)=>{
        if(err){
            console.log(err);
        }
        //已加分的活动
        activity_added = JSON.parse(JSON.stringify(results))
        let dataList = []
        activity_added.forEach(item => {
            let obj = {}
            let str1 = ''
            let str2 = ''
            for (let [key, value] of Object.entries(item)) {
                if (key == '活动名称') {
                    obj.activity = value
                }
                if (key == '活动日期') {
                    let date = value.split('-')
                    // console.log(date)
                    let month = date[1]
                    let day = date[2]
                    if (parseInt(month) < 10 ) {
                        month = month.slice(1,2)
                    }
                    if (parseInt(day) < 10 ) {
                        day = day.slice(1,2)
                    }
                    let str = month + '月' + day + '日'
                    obj.time = str
                }
            }
            dataList.push(obj)
        })
        // console.log(dataList)
        res.send({
            data: dataList,
            msg: '获取活动报名信息成功'
        })
    })
});

//学生修改密码
router.post('/update/password', (req, res) => {
    let stuid = req.body.id
    let new_password = req.body.resure

    let stutable = stuid.slice(2,4) + "级学生表"
    let sql = `UPDATE ${stutable} SET 密码=${new_password} WHERE 学号 = ${stuid}`
    db.query(sql,(err,results)=>{
        if(err){
            // console.log(err)
            throw err
        }
        res.send({
            msg: '密码修改成功',
            code: '1'
        })
    })
})

//学生查看个人加分详情
router.post('/scoreDetail', (req, res,next) => {
    let id = req.body.userId
    let stutable = id.slice(2,4) + "级学生表"
    let sql=`SELECT * FROM ${stutable} WHERE 学号=${id};`
    db.query(sql,(err,results)=>{
        if(err){
            // console.log(err)
            throw err
        }
        //活动细节
        let detial = JSON.parse(JSON.stringify(results))

        let Data = []
        detial.forEach(element => {
            for (let key in element) {
                if (key == '学号' || key == '姓名' || key == '班级' || key == '总分' || key == '密码') {
                    delete element[key]
                }
            }
        })
        detial.forEach(element => {
            for (let [key, value] of Object.entries(element)) {
                num = key.slice(0,key.indexOf('_'))
                let year = num.slice(0,4)
                let month = num.slice(4,6)
                let day = num.slice(6)
                let obj = {}
                let date = year + '年' + month + '月' + day + '日'
                obj['活动'] = key.slice(key.lastIndexOf('_')+1)
                if (parseInt(value) > 0) {
                    let score = '+' + value
                    obj['分数'] = score
                } else {
                    obj['分数'] = value
                }
                obj['日期'] = date
                Data.push(obj)
            }
        })
        let DataList = Data.filter(item => {
            if (item['分数'] != null) {
                return item
            }
        })
        res.json({
            msg: '个人活动信息查询成功',
            data: DataList,
            code: 1
        })
    })
})

//提交疑问
router.post('/question', (req, res) => {
    let question = req.body.question
    let id = req.body.userId
    let name = req.body.name
    let cla = req.body.cla

    let date = new Date()
    // console.log(date)
    // var nowTime = now.toLocaleString(); 
    // var date = nowTime.substring(0,10);//截取日期 
    // var time = nowTime.substring(10,20); //截取时间 

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    if (hours < 10) {
        hours = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    let nowDate = year + "/" + month + "/" + day + "/" + hours + ":" + minutes + ":" + seconds 
    let sql = `insert into 问题反馈表(姓名, 学号, 问题, 提交时间, 是否解决, 班级) value ('${name}','${id}','${question}','${nowDate}','0', '${cla}')`
    // db.query("INSERT INTO 问题反馈表 VALUES(?,?,?,?,?)",[name,id,question,nowDate,"0"],(err,results)=>{
    db.query(sql, (err, results) => {
        if(err){
            console.log(err)
            throw err
        }
        // console.log(results);
        res.send({
            msg: '问题发布成功',
            code: '1'
        })
        
    })
})  


// 修改昵称
router.post('/updateNickname', (req, res) => {
    let { nickname, id } = req.body
    // console.log(nickname)
    // console.log(id)
    let sql = `update 学生信息记录表 set nickname='${nickname}' where 学号='${id}'`
    if (nickname != '') {
        db.query(sql, (err, rows) => {
            if (err) {
                throw err
            } else {
                // console.log(rows)
                res.send({
                    msg: '昵称修改成功',
                    code: '1'
                })
            }
        })
    }
})

// 修改邮箱
router.post('/updateEmail', (req, res) => {
    // let email = req.body.email
    // let id = req.body.id
    let { email, id } = req.body
    // console.log(email)
    // console.log(id)
    let sql = `update 学生信息记录表 set email='${email}' where 学号='${id}'`
    if (email != '') {
        db.query(sql, (err, rows) => {
            if (err) {
                throw err
            } else {
                // console.log(rows)
                res.send({
                    msg: '邮箱修改成功',
                    code: '1'
                })
            }
        })
    }
})

// 初次登录为个人插入信息到学生信息记录表
router.get('/InsertRecord', (req, res) => {
    // let id = req.query.id
    // let name = req.query.name
    let { id, name } = req.query
    let sql1 = `select * from 学生信息记录表 where 学号='${id}'`
    db.query(sql1, (err, rows) => {
        if (err) {
            throw err
        } 
        let data = JSON.parse(JSON.stringify(rows))
        // console.log(data)
        if (data.length == 0) {
            let sql2 = `insert into 学生信息记录表 (姓名,学号) value ('${name}', '${id}')`
            db.query(sql2, (err, rows) => {
                if (err) {
                    throw err
                } 
                else {
                    // console.log(rows)
                    res.send({
                        msg: '信息插入成功',
                        data: data
                    })
                }
            })
        } else {
            res.send({
                msg: '信息已经插入过'
            })
        }
    })
})

// 获取昵称，头像，邮箱
router.get('/getRecord/:id', (req, res) => {
    let id = req.params.id
    // console.log(id)
    let name = req.query.name
    // console.log(name)
    let sql1 = `select * from 学生信息记录表 where 学号='${id}'`
    db.query(sql1, (err, rows) => {
        if (err) {
            throw err
        } 
        let data = JSON.parse(JSON.stringify(rows))
        if (data.length > 0) {
            let sql = `select nickname, avatar, email from 学生信息记录表 where 学号='${id}'`
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err
                } else {
                    let data1 = JSON.parse(JSON.stringify(rows))
                    if (data1.length != 0) {
                        res.send({
                            data: data1,
                            code: '1',
                            msg: '查询成功'
                        })
                    } else {
                        res.send({
                            msg: 'OK', 
                            data: data1
                        })
                    }
                }
            })
        } else {
            res.send({
                msg: '无相关信息',
                data: data
            })
        }
    })
})

// 学生获取问题反馈
router.get('/getquestion', (req, res) => {
    let id = req.query.id
    let sql = `select 问题, 是否解决 from 问题反馈表 where 学号='${id}'`
    db.query(sql, (err, row) => {
        if (err)
            throw err
        else {
            // console.log(row)
            let data = JSON.parse(JSON.stringify(row))
            let dataList = []
            data.forEach(item => {
                let obj = {}
                for (let [key, value] of Object.entries(item)) {
                    if (key == '问题') {
                        obj.question = value
                    }
                    if (key == '是否解决') {
                        if (value == '是') {
                            obj.solve = '是'
                        } else {
                            obj.solve = '否'
                        }
                    }
                }
                dataList.push(obj)
            })
            // console.log(dataList)
            res.send({
                data: dataList,
                msg: '问题查询成功'
            })
        }
    })
})

// 学生删除自己的问题
router.post('/deletequestion', (req, res) => {
    // let id = req.body.id
    // let question = req.body.question
    let { id, question } = req.body
    // console.log(id, question)
    let sql = `delete from 问题反馈表 where 学号='${id}' and 问题='${question}'`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.log(rows)
        res.send({
            msg: '问题已经成功删除'
        })
    })
})

}, (err) => {
    console.log(err)
})

module.exports = router
