var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var connection = require('./mysql')



// 解决跨域问题
// app.use(require('cors')())



//设置跨域访问
app.all('*', function(req, res, next) {
    // console.log(req.headers.origin)
    // console.log(req.originalUrl)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, authorization, Accept, X-Requested-With, refreshtoken');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,HEAD");
    res.header("X-Powered-By",' 3.2.1')
    // 不设置content-type类型，让res自己判断返回类型
    res.header("Content-Type", "application/json;charset=utf-8");
    //设置请求头可携带cookie
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//cookie的创建（存储到cookie中） res.cookie(name, value [, options])
//cookie的读取  req.cookies/req.cookies.name
//cookie的删除res.clearCookie(name [, options])
app.use(cookieParser());

// 拿到request的请求体body
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// 保证文件能够发送过来
app.use(bodyParser.json({limit : '2100000kb'}))


app.use('/admin', require('./admin'))
app.use('/super', require('./superadmin'))
app.use('/user', require('./student'))
app.use('/test', require('./timerevent'))
app.use('/api', require('./image'))
app.use('/user', require('./login'))


app.listen(9090, () => {
    console.log('server 9090')
})