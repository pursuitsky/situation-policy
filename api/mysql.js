var mysql = require('mysql')
var db = {}

// 创建连接池方式连接mysql
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'new_password',
    database: 'mark',
    multipleStatements: true
})

db.query = function(sql, value, callback){

    if(!sql){
        callback(err, null)
        return
    }
    pool.query(sql,value,function(err,rows,fields){
        if(err){
            console.log(err)
            callback(err,null)
            //断开连接后就1s后重连
            console.log('try to connect')
            setTimeout(() => {
                db.query(sql, value, callback)
            }, 1000)
            return
        }
        callback(null,rows,fields)
    })
    pool.releaseConnection(db)
}

// mysql模块、connection.beginTransaction是做事务,用事务循环插入、如果有一条插入失败进行回滚改天研究一下

//回调重连，采用链式链接方式
// const mysql = require('mysql');
// // mysql 连接配置
// const mysqlConf = {
//   host: 'localhost',
//   user: 'root',
//   password: 'xxxxxx',
//   database: 'myDb',
//   dateStrings: true
// }
// // 用于保存数据连接实例
// var db = null;
// var pingInterval;
// // 如果数据连接出错，则重新连接
// function handleError(err) {
//   logger.info(err.stack || err);
//   connect();
// }
// // 建立数据库连接
// function connect() {
//   if (db !== null) {
    //结束连接
//     connection.end();
    //暴力结束连接
//     db.destroy();
//     db = null;
//   }
//   db = mysql.createConnection(mysqlConf);
//   db.connect(function (err) {
//     if (err) {
//       logger.info("error when connecting to db,reConnecting after 2 seconds:", err);
//       setTimeout(connect, 2000);
//     }
//   });
//   db.on("error", handleError);
//   // 每个小时ping一次数据库，保持数据库连接状态
//   clearInterval(pingInterval);
//   pingInterval = setInterval(() => {
//     console.log('ping...');
//     db.ping((err) => {
//       if (err) {
//         console.log('ping error: ' + JSON.stringify(err));
//       }
//     });
//   }, 3600000);
// }
// connect();


module.exports = db

//常见参数配置
// 　　host：主机地址 （默认：localhost）
// 　　user：用户名
// 　　password：密码
// 　　port：端口号 （默认：3306）
// 　　database：数据库名
// 　　charset：连接字符集（默认：'UTF8_GENERAL_CI'，注意字符集的字母都要大写）
// 　　localAddress：此IP用于TCP连接（可选）
// 　　socketPath：连接到unix域路径，当使用 host 和 port 时会被忽略
// 　　timezone：时区（默认：'local'）
// 　　connectTimeout：连接超时（默认：不限制；单位：毫秒）
// 　　stringifyObjects：是否序列化对象（默认：'false' ；与安全相关https://github.com/felixge/node-mysql/issues/501）
// 　　typeCast：是否将列值转化为本地JavaScript类型值 （默认：true）
// 　　queryFormat：自定义query语句格式化方法 https://github.com/felixge/node-mysql#custom-format
// 　　supportBigNumbers：数据库支持bigint或decimal类型列时，需要设此option为true （默认：false）
// 　　bigNumberStrings：supportBigNumbers和bigNumberStrings启用 强制bigint或decimal列以JavaScript字符串类型返回（默认：false）
// 　　dateStrings：强制timestamp,datetime,data类型以字符串类型返回，而不是JavaScript Date类型（默认：false）
// 　　debug：开启调试（默认：false）
// 　　multipleStatements：是否许一个query中有多个MySQL语句 （默认：false）
// 　　flags：用于修改连接标志，更多详情：https://github.com/felixge/node-mysql#connection-flags
// 　　ssl：使用ssl参数（与crypto.createCredenitals参数格式一至）或一个包含ssl配置文件名称的字符串，目前只捆绑Amazon RDS的配置文件
