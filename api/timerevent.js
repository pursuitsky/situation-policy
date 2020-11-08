var express = require('express')
var app = express()
var mysql = require('mysql')
var schedule = require('node-schedule')
var nodemailer = require('nodemailer')
var db = require('./mysql')


// 为mysql创建定时事务，当请求接口的时候，创建事务并定时删除数据，没实现放弃了
app.post('/deleteevent', (req, res) => {
    let sql = 'show variables like "%event_scheduler%"'
    db.query(sql, (err, rows) => {
        if (err)
            throw err
        // console.log(rows)
        console.log(JSON.parse(JSON.stringify(rows)))
        // Value为ON则已打开，OFF则关闭,如果是OFF，就先打开：SET GLOBAL event_scheduler = ON;
        res.send({statue: 'OK'})  
        let sql = `create event myevent on SCHEDULE every 5 second do delete from Syslog.SystemEvents where 
        ReceivedAt<(CURRENT_TIMESTAMP() + INTERVAL -5 DAY) `
    })
})

// ALTER TABLE 问题反馈表 ADD update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

// 每隔七天定时删除问题反馈表中已经解决的数据
function scheduleCronstyle() {
    // 每周一00:00触发函数
    schedule.scheduleJob('30 20 13 * * 1', () => {
        let sql = 'select * from 问题反馈表'
        let datalist = []
        let promise = new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err)
                    throw err
                let list = JSON.parse(JSON.stringify(rows))
                list.forEach(element => {
                    if (element['是否解决'] == '是') {
                        datalist.push(element)
                    }
                })
                resolve(datalist)
            })
        })
        promise.then(v => {
            // console.log(v)
            if (v.length != 0) {
                // 查询距当前时间小于等于7天内的数据
                // SELECT 表名.字段 FROM 表名 where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(时间字段名)
                // 时间大于8天且是否解决=是的数据
                let sql = 'delete from 问题反馈表 where 是否解决="是" and date_sub(now(), interval 8 day) > date(update_time)'
                db.query(sql, (err, rows) => {
                    if (err)
                        throw err
                    console.log(rows)
                })
            }
        })
    })
}
  
scheduleCronstyle()

async function testAsync() {
    return "hello async";
}

const result = testAsync();
// console.log(result);
testAsync().then(v => {
    // console.log(v);    // 输出 hello async
});

function getSomething() {
    return "something";
}

async function testasync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testasync();
    console.log('v1:',v1)
    console.log(v1, v2);
}

// test()


async function sendEmail (mailOptions) {
    try {
        // 发件箱配置
        let transporter = nodemailer.createTransport({
            host: 'smtp.qq.com',
            port: 465,
            secureConnection: true,
            secure: true,
            service: 'qq',
            auth: {
                // user: '2311491587@qq.com',
                // pass: 'lsgdnfxyoaiwdica'
                user: '3287990296@qq.com',
                pass: 'qnpoeddcwrwdcihi'
            }
        })
        // 封装成对象
        // var mailOptions = {
        //     // 发送邮件的地址
        //     from: '"发送人" <邮箱地址地址>', // login user must equal to this user
        //     // 接收邮件的地址
        //     to: "接收者邮箱地址", // xrj0830@gmail.com
        //     // 邮件主题
        //     subject: "你有一条新消息",
        //     // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
        //     html: sendHtml
        // }
        // 收件箱配置
        await transporter.sendMail(
            mailOptions,
            (error, info={}) => {
                if (error) {
                    return console.log(error)
                }
                console.log('Message sent')
        })
    } catch (error) {
        console.log(error)
    }
}

// 发送邮箱
app.post('/feedback', (req, res) => {
    let id = req.body.id
    let question = req.body.question
    console.log(id)
    console.log(question)
    // res.send({msg: 'OK'})
    let sql1 = `update 问题反馈表 set 是否解决='是' where 学号='${id}' and 问题='${question}'`
    db.query(sql1, (err, rows) => {
        if (err)
            throw err
        else {
            // console.log(rows)
            let sql2 = `select email, 姓名 from 学生信息记录表 where 学号='${id}'`
            db.query(sql2, (err, rows) => {
                if (err)
                    throw err
                else {
                    let result = JSON.parse(JSON.stringify(rows))
                    let email = result[0].email
                    let name = result[0]['姓名']
                    if (email != '') {
                        let mailOptions = {
                            from: `"发送人"<3287990296@qq.com>`,
                            to: `${email}`,
                            subject: '问题反馈', 
                            html: `<p>你好${name},你的问题：</p>
                                <p>${question}</p>
                                <p>理学部已经知晓并解决</p>`,
                        }
                        sendEmail(mailOptions)
                        res.send({
                            msg: '信息反馈已经送达',
                            message: '问题已解决',
                            code: '1'
                        })
                    } else {
                        res.send({
                            message: '问题已解决',
                            code: '1'
                        })
                    }
                }
            })
        }
    })
})

// 删除活动记录表信息

module.exports = app