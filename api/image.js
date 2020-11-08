var express = require('express')
var app = express()
var fs = require('fs')
// var multer = require('multer')
// var formidable = require('formidable')
var multiparty = require('multiparty')
var path = require('path')
var db = require('./mysql')

// 与multipary功能类似
// var multipart= require('connect-multiparty')
// var multipartMiddleware = multipart()
// app.use(multipart({uploadDir: '/upload'}))
// app.post('/formdata',multipartMiddleware, function (req,res) {
//     res.send(req.body,req.files,req.files.file.path);//分别返回body，文件属性，以及文件存放地址
// }

app.use('/static',express.static(path.join(__dirname, './file')))
app.use('/public',express.static(path.join(__dirname, './image')))
// console.log(__dirname)
// console.log(path.join(__dirname))
// console.log(path.dirname(__dirname))

app.post('/image',(req, res) => {
    // let form = new formidable.IncomingForm()
    // form.parse(req, (err, fields, files) => {
    //     console.log(files)
    // })

    // console.log(req.headers)

    //生成multiparty对象，并配置上传目标路径
    let form = new multiparty.Form({uploadDir: './file'})
    //上传完成后处理
    form.parse(req, (err, fields, files) => {
        // console.log(fields, files, fields)
        // 根据formdata中键获取对应值
        // console.log(fields.name)
        // console.log(fields.id)
        // console.log(files.file[0].originalFilename)
        // 获取图片名字有问题,存入的是修改的名字，如果需要按照原来的命名，需要重新修改
        let fileName = files.file[0].path.slice(5)
        // fileName = fields.name[0]
        console.log(fileName)
        // let apath = `http://localhost:9090/api/static/${fileName}`
        if (err) {
            console.log('parse error:' + err)
        } else {
            let name = fields.name[0].split('.')
            let idName = fields.id[0]
            let uploadedPath = files.file[0].path
            let user = fields.username[0]
            console.log(user)
            // let dstPath = './file/' + files.file[0].originalFilename
            let dstPath = './file/' + `${idName}.${name[1]}`
            console.log(dstPath)
            fs.rename(uploadedPath, dstPath, (err) => {
                if (err) {
                    console.log('rename error:' + err)
                } else {
                    // let name = files.file[0].originalFilename
                    let apath = `http://localhost:9090/api/static/${idName}.${name[1]}`
                    // res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'})
                    // res.end()
                    // res.set('content-type', '')
                    let sql1 = `select * from 学生信息记录表 where 学号=${idName} `
                    db.query(sql1, (err, rows) => {
                        if (err) {
                            throw err
                        } else {
                            console.log('sql1:',rows)
                            // res.send({msg: '图片上传成功', path: apath})
                            let data = JSON.parse(JSON.stringify(rows))
                            // console.log(data.length)
                            if (data.length == 0) {
                                let sql2 = `insert into 学生信息记录表 (学号, 姓名, avatar) values ('${idName}', '${user}', '${apath}')`
                                console.log(sql2)
                                db.query(sql2, (err, result) => {
                                    if (err) 
                                        throw err
                                    else {
                                        console.log(result)
                                        res.send({
                                            msg: '图片上传成功', 
                                            path: apath
                                        })
                                    }
                                })
                            } else {
                                let sql3 = `update 学生信息记录表 set avatar='${apath}' where 学号='${idName}'`
                                db.query(sql3, (err, result) => {
                                    if (err)
                                        throw err
                                    else {
                                        console.log(result)
                                        res.send({
                                            msg: '图片修改成功', 
                                            path: apath
                                        })
                                    }
                                })
                                // res.send({
                                //     msg: '图片修改成功', 
                                //     path: apath
                                // })
                            }
                        }
                    })
                }
            })
        }
    })
})

app.post('/upimage', (req, res) => {
    // base64实际太大了不合适,千万不要打印出来数据
    let data = req.body.data
    let name = req.body.name.split('.')
    console.log(name)
    let id = req.body.id
    let user = req.body.username
    //去掉图片base64码前面部分data:image/png;base64
    let base64Data = data.replace(/^data:image\/\w+;base64,/, "")
    //把base64码转成buffer对象
    let dataBuffer = new Buffer(base64Data, 'base64')
    fs.writeFile(`./image/${name[0]}.${name[1]}`, dataBuffer, (err, data) => {
        // res.send({data: 'OK'})
        console.log(err)
        // console.log(data)
    }) 
    setTimeout(() => {
        fs.readFile(`./image/${name[0]}.${name[1]}`, 'binary', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(data)
                // let reg = /\.(png|jpg|gif|jpeg|webp)$/
                // let fileType = req.body.name.match(reg)[1]
                let fileType = name[1]
                let  buffer = new Buffer(data, 'binary')

                let src = 'data: image/'+ `${fileType}` +';base64,' + buffer.toString('base64')
                let url = `http://localhost:9090/api/public/${name[0]}.${name[1]}`

                let sql1 = `select * from 学生信息记录表 where 学号=${id} `
                db.query(sql1, (err, rows) => {
                    if (err) {
                        throw err
                    } else {
                        console.log(rows)
                        let data = JSON.parse(JSON.stringify(rows))
                        if (data.length == 0) {
                            let sql2 = `insert into 学生信息记录表 (学号, 姓名, avatar) values ('${id}', '${user}', '${url}')`
                            db.query(sql2, (err, result) => {
                                if (err) 
                                    throw err
                                else {
                                    console.log(result)
                                    res.send({
                                        msg: '图片上传成功', 
                                        apath: {
                                            data: data, 
                                            type: name[1], 
                                            name: name[0]
                                        }, 
                                        path: src, 
                                        url: url
                                    })
                                }
                            })
                        } else {
                            let sql3 = `update 学生信息记录表 set avatar='${url}' where 学号='${id}'`
                            db.query(sql3, (err, result) => {
                                if (err)
                                    throw err
                                else {
                                    console.log(result)
                                    res.send({
                                        msg: '图片修改成功', 
                                        apath: {
                                            data: data, 
                                            type: name[1], 
                                            name: name[0]
                                        }, 
                                        path: src, 
                                        url: url
                                    })
                                }
                            })
                        }
                    }
                })

                // res.send({msg: '二进制流和base64流图片', apath: {data: data, type: name[1], name: name[0]}, path: src, url: url})
            }
        })
    }, 100)
    // 读取文件，将二进制流转换为base64流
    // fs.readFile('你的资源路径','binary',function(err,data){
    //     if(err){
    //         console.log(err)
    //     }else{
    //         const buffer = new Buffer(data, 'binary');
    //         img.src = 'data: image/'+ getImageType(fileName) +';base64,' + buffer.toString('base64');
    //     }
    // });
    
})

// const multer = require("multer")
// var upload = multer({ dest: 'public/uploads/' })
// router.post("/form",upload.array('files', 5),function(req,res){
// 	req.files.forEach(function(file){
//         var extname = path.extname(req.files[0].originalname);  
//         fs.rename(file.path,file.destination+"upload_"+new Date()*1+extname,function(err){   
//             if(err){
//                 res.send("重命名错误");
//             }else{
//                 res.send("文件上传成功");
//             }
//         })
//     })
// })


module.exports = app