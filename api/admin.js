var express = require('express');
var router = express.Router();
var url = require('url')
var db = require('./mysql')

// var server=http.createServer(function(req,resp){
//     console.log("请求地址是:"+req.url);    

//     //这样设置才可以解决跨域的请求
//     resp.writeHead(200,{"Content-Type":"text/plain;charset='utf-8'",'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'
// });

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

// 打印数据库表名
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

// 单独加分：通过学号或者姓名搜索学生信息
router.post('/individual/getByNameOrId', function(req, res) {
    let data = req.body
    let sql = ''
    let key_val = ''
    let val = ''
    for(let [key, value] of Object.entries(data)) {
        key_val = key
        val = value
    }
    if(key_val == "学号") {
        let stutable = val.slice(2,4) + "级学生表"
        sql = `SELECT 班级,姓名,学号 FROM ${stutable} WHERE 学号=${val}`
        db.query(sql, (err, results, fields) => {
            if(err){
              console.log(err)
              throw err
            }
            let data = JSON.parse(JSON.stringify(results))
            console.log(data)
            res.send({
                msg: '通过学号查询成功',
                data: data
            })
        })
    }
    if (key_val == '姓名'){
        let dataList = []
        for (let i = 0; i < database.length; i++) {
            dataList.push(new Promise((resolve, reject) => {
                let sql = `select 班级,姓名,学号 from ${database[i]} where 姓名="${val}"`
                db.query(sql, (err, rows, fields) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    let data1 = JSON.parse(JSON.stringify(rows))
                    resolve(data1)
                }) 
            }))
        }
        Promise.all(dataList).then(array => {
            let arrayList = array
            let data2 = []
            for (let i of arrayList) {
                if (i.length > 0) {
                    i.forEach(item => {
                        data2.push(item)
                    })
                }
            }
            return res.send({
                msg: '通过姓名查询成功',
                data: data2
            })
        })
    }
})

// app.post('/flow/save', require('body-parser').json(), traffic);
// 用的qs.stringfy()将对象转码，然后在node的后台再用qs.parse()解析
// 单独加分：一键加分
router.post('/individual/addScore', function(req, res) {
    let data = req.body
    let cla 
    let name 
    let userId
    let ActivityName
    let score
    let date
    data.forEach(element => {
        for (let [key, value] of Object.entries(element)) {
            if (key == '班级')  cla = value
            if (key == '姓名')  name = value
            if (key == '学号')  userId = value
            if (key == 'ActivityName')  ActivityName = value
            if (key == 'score')  score = value
            if (key == 'date')  date = value
        }
        let activityTime = date + '_' + ActivityName
        let date_time = date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6)
        // console.log(date_time)

        //用来返回单个活动的加分信息
        // db.query("INSERT INTO 活动记录表 VALUES(?,?,?,?,?,?,?)",[userId,name,ActivityName,date_time,"1","1",score], (err, result, fields) => {
        //     if (err) {
        //         console.log(err)
        //     }
        //     console.log(result)
        // })
        // 如果学号是高年级留级已经不在四个年级里面没考虑，总分也需要更新一下忘记写这个操作了
        // 插入到对应的属性列中 
        let stutable = userId.slice(2,4) + "级学生表"
        db.query(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = '${stutable}'`, (err, rows) => {
            if (err) {
                throw err
            }
            let tablelist = []
            let columns = JSON.parse(JSON.stringify(rows))
            // console.log(columns)
            columns.forEach(item => {
                for (let key in item) {
                    tablelist.push(item[key])
                }
            })
            // console.log(tablelist)
            if(!tablelist.some(item => {
                return item == activityTime
            })) {
                // 创建属性列
                let sql1 = `alter table ${stutable} add column ${activityTime} varchar(255)`
                db.query(sql1, (err, rows) => {
                    if (err) {
                        throw err
                    }
                    console.log(rows)
                    let sql2 = `UPDATE ${stutable} SET ${activityTime} = "${score}" WHERE 学号 = "${userId}"`
                    // console.log(sql2)
                    db.query(sql2, (err, rows) => {
                        if (err) {
                            throw err
                        }
                        // console.log(rows)
                    })
                })
            } else {
                // 属性列在数据库直接插入数据
                // let sql2 = `UPDATE ${stutable} SET ${activityTime} = "${score}" WHERE 学号 = "${userId}"`
                // let sql2 = 'update from '+ stutable+' set '+ activityTime+'='+score+' where 学号='+userId
                db.query(`UPDATE ${stutable} SET ${activityTime} = "${score}" WHERE 学号 = "${userId}"`, (err, rows) => {
                    if (err) {
                        throw err
                    }
                    // console.log(rows)
                })
            }
        })
    })
    //这里应该用Promise来判断db是否执行完成，目前没写，而是延期1s后发送响应，目的让db异步操作执行完在发送响应
    setTimeout(() => {
        res.send({
            msg: '信息插入成功'
        })
    }, 1000)
})

// 统一加分：获得所有活动加分信息
router.get('/all/totalInformation', function (req, res) {
    let sql = 'select 姓名,学号,活动名称,活动日期,分数 from 活动记录表 where 是否加分 = 0'
    db.query(sql,(err, results)=>{
        if (err) {
            console.log(err)
            throw err
        } else {
            let data = JSON.parse(JSON.stringify(results))
            // console.log(data)
            let dataList = []
            data.forEach(item => {
                let obj = {}
                for (let [key, value] of Object.entries(item)) {
                    if (key == '姓名') {
                        obj.name = value
                    }
                    if (key == '学号') {
                        obj.userId = value
                    }
                    if (key == '活动名称') {
                        obj.activity = value
                    }
                    if (key == '分数') {
                        obj.score = value
                    }
                    if (key == '活动日期') {
                        obj.time = value
                    }
                }
                dataList.push(obj)
            })
            res.send({
                msg: '活动信息查询成功',
                data: dataList
            })
        }
    })
})


// 统一加分：通过活动名称搜索该活动参加的学生信息
router.get('/all/totalInformationByName/:Name', function(req, res) {
    let Name = req.params.Name
    // console.log(Name)
    let sql = `select 学号,姓名,活动名称,分数, 活动日期 from 活动记录表 where 活动名称 LIKE '%${Name}%' and 是否加分=0`
    db.query(sql, (err, rows) =>{
        if (err) {
            console.log(err)
            return
        }
        let data = JSON.parse(JSON.stringify(rows))
        if (data.length > 0) {
            let dataList = []
            data.forEach(item => {
                let obj = {}
                for (let [key, value] of Object.entries(item)) {
                    if (key == '班级') {
                        obj.class = value
                    }
                    if (key == '姓名') {
                        obj.name = value
                    }
                    if (key == '学号') {
                        obj.userId = value
                    }
                    if (key == '活动名称') {
                        obj.activity = value
                    }
                    if (key == '分数') {
                        obj.score = value
                    }
                    if (key == '活动日期') {
                        obj.time = value
                    }
                }
                dataList.push(obj)
            })
            res.send({
                msg: '活动信息查询成功',
                data: dataList
            })
        } else {
            res.send({
                msg: `没有搜到${Name}此活动的相关加分记录`,
                data: data
            })
        }
    })
})

// 统一加分：点击一键加分添加所有信息
router.post('/all/addScore', (req, res) => {
    let data = req.body
    let cla 
    let name 
    let userId
    let ActivityName
    let score
    let time
    data.forEach(element => {
        for (let [key, value] of Object.entries(element)) {
            if (key == 'class')  cla = value
            if (key == 'name')  name = value
            if (key == 'userId')  userId = value
            if (key == 'activity')  ActivityName = value
            if (key == 'score')  score = value
            if (key == 'time')  time = value
        }
        let activityTime = time.split('-')[0] + time.split('-')[1] + time.split('-')[2] + '_' + ActivityName

        // 更新活动记录表
        let sql = `update 活动记录表 set 是否加分='1' where 学号='${userId}' and 活动名称='${ActivityName}' and 活动日期='${time}' and 分数='${score}'`
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                throw err
            }
            // console.log(result)
        })

        // 如果学号是高年级留级已经不在四个年级里面没考虑，没写更新总分的操作
        // 插入到对应的属性列中 
        let stutable = userId.slice(2,4) + "级学生表"

        //查询表中的属性列
        db.query(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = '${stutable}'`, (err, rows) => {
            if (err) {
                throw err
            }
            let tablelist = []
            let columns = JSON.parse(JSON.stringify(rows))
           
            columns.forEach(item => {
                for (let key in item) {
                    tablelist.push(item[key])
                }
            })
            //如果当前要插入的属性列在表中不存在
            if(!tablelist.includes(activityTime)) {
                // 创建属性列
                let sql1 = `alter table ${stutable} add column ${activityTime} varchar(255)`
                db.query(sql1, (err, rows) => {
                    if (err) {
                        throw err
                    }
                    
                    let sql2 = `update ${stutable} set ${activityTime} = "${score}" where 学号 = "${userId}"`
                    
                    db.query(sql2, (err, rows) => {
                        if (err) {
                            throw err
                        }
                    })
                })
            } else {
                // 属性列在当前表中，则直接插入数据
                db.query(`update ${stutable} set ${activityTime} = "${score}" where 学号 = "${userId}"`, (err, rows) => {
                    if (err) {
                        throw err
                    }
                })
            }
        })
    })
    //这里应该用Promise来判断db是否执行完成，目前没写，而是延期1s后发送响应，目的让db异步操作执行完在发送响应
    setTimeout(() => {
        res.send({
            msg: '信息插入成功'
        })
    }, 1000)
})


// 活动管理：发布活动信息
router.post('/publish/add', (req, res) => {
    let data = req.body
    // console.log(data)
    let ActivityName = data.name
    let region = data.region
    // 与前台发送的数据差八个小时
    let date1 = data.date1.slice(0, 10)
    let date2 = data.date2.slice(11, 19)
    let score = data.score
    let num = data.num
    let content = data.desc
    // console.log(ActivityName, region, date1, date2, score, num, content)
    
    let date = new Date()
    console.log(date)
    let year = date.getFullYear()
    let month = date.getMonth() + 1 
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let nowDate = year + "年" + month + "月" + day + "日" + hours + ":" + minutes + ":" + seconds 
    // console.log(nowDate)
    
    // let sql = `insert into 活动信息表(名称, 地点, 日期, 时间, 分数, 名额, 内容) values (?,?,?,?,?,?,?)`
    let sql = `insert into 活动信息表(名称, 地点, 日期, 时间, 分数, 名额, 内容, 发布时间, 剩余名额, 是否结束报名) value ('${ActivityName}','${region}','${date1}','${date2}','${score}','${num}','${content}','${nowDate}', '${num}', '0')`
    const value = [
        ActivityName, 
        region,
        date1,
        date2,
        score,
        num,
        content
    ]
    db.query(sql, (err, rows) => {
        if (err)
            throw err
        else {
            // console.log(rows)
            res.send({
                msg: '活动插入成功',
                code: '1'
            })
        }
    })
})

// 活动管理：获取所有已发布正在进行的活动信息
router.get('/publish/published', (req, res) => {
    let data = []
    let sql = 'select * from 活动信息表 where 是否结束报名="0"'
    db.query(sql, (err, rows) => {
        if (err) 
            throw err
        else {
            // console.log(rows)
            let data = JSON.parse(JSON.stringify(rows))
            let dataList = []
            data.forEach(item => {
                let obj = {}
                let str1 = ''
                let str2 = ''
                for (let [key, value] of Object.entries(item)) {
                    if (key == '发布时间') {
                        obj.publishDate = value
                    }
                    if (key == '日期') {
                        str1 = value
                    }
                    if (key == '时间') {
                        str2 = value
                    }
                    if (key == '地点') {
                        obj.location = value
                    }
                    if (key == '名称') {
                        obj.activity = value
                    }
                }
                let startTime = str1 + '/' + str2
                obj.startTime = startTime
                dataList.push(obj)
            })
            // console.log(dataList)
            res.send({
                msg: '正在进行的活动信息获取成功', 
                data: dataList
            })
        }
    })
})

// 活动管理：获取所有已结束报名的活动信息
router.get('/publish/accomplish', (req, res) => {
    let data = []
    let sql = 'select * from 活动信息表 where 是否结束报名="1"'
    db.query(sql, (err, rows) => {
        if (err) 
            throw err
        else {
            // console.log(rows)
            let data = JSON.parse(JSON.stringify(rows))
            let dataList = []
            data.forEach(item => {
                let obj = {}
                let str1 = ''
                let str2 = ''
                for (let [key, value] of Object.entries(item)) {
                    if (key == '发布时间') {
                        obj.publishDate = value
                    }
                    if (key == '日期') {
                        str1 = value
                    }
                    if (key == '时间') {
                        str2 = value
                    }
                    if (key == '地点') {
                        obj.location = value
                    }
                    if (key == '名称') {
                        obj.activity = value
                    }
                }
                let startTime = str1 + '/' + str2
                obj.startTime = startTime
                dataList.push(obj)
            })
            // console.log(dataList)
            res.send({
                msg: '已经结束报名的活动信息获取成功', 
                data: dataList
            })
        }
    })
})

// 活动管理：截止活动报名
router.post('/publish/deadline', (req, res) => {
    let name = req.body.name
    let time = req.body.time
    // console.log(name, time)
    let date = time.split('/')[0]
    let sql = `update 活动信息表 set 是否结束报名='1' where 是否结束报名="0" and 名称='${name}' and 日期='${date}'`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.log(rows)
        res.send({
            msg: `${name}截止报名成功`
        })
    })
})

// 活动管理：点击删除按钮，删除已发布的活动信息
router.post('/publish/delete', (req, res) => {
    let name = req.body.name
    let time = req.body.time
    let location = req.body.location
    // console.log(name, time, location)
    let date = time.split('/')[0]
    // console.log(date)
    let sql = `delete from 活动信息表 where 是否结束报名="1" and 名称='${name}' and 日期='${date}'`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        // console.log(rows)
        res.send({
            msg: `${name}活动删除成功`, 
        })
    })
})

// 问题统计：获取学生的所有问题 
router.post('/question/user', (req, res) => {
    let sql = 'select 姓名, 学号, 班级, 问题, 提交时间 from 问题反馈表 where 是否解决!="是"'
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        let dataList = []
        data.forEach(element => {
            let obj = {}
            for (let [key, value] of Object.entries(element)) {
                if (key == '姓名') {
                    obj.name = value
                }
                if (key == '学号') {
                    obj.id = value
                }
                if (key == '班级') {
                    obj.myClass = value
                }
                if (key == '问题') {
                    obj.question = value
                }
                if (key == '提交时间') {
                    obj.time = value
                }
            }
            dataList.push(obj)
        })
        // console.log(dataList)
        res.send({
            status: 'OK', 
            code: 1, 
            data: dataList
        })
    })
})

}, (err) => {
    console.log(err)
})

module.exports = router