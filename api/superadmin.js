var express = require('express')
var app = express()
var db = require('./mysql')

//构造一个promise将查询db获取数据库信息由异步执行变成同步执行,同步获取数据库信息,便于后面的数据调用数据库信息,
//如果直接把查询结果通过普通函数return,由于异步导致函数数据为空
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

// var database = Array.from(promise)
// console.log(typeof database)
// console.log(typeof promise)

//promise要用then接收或者async await
promise.then(res => {
//打印数据库表名
// console.log('数据库表名:'+res)
// console.log(res)
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
// console.log(database)
//这里需要说明一下,考虑到学生表不断需要更新,每次命名规则格式为'17级学生表',这样可以根据数据库信息经行修改,而不再需要后台维护代码

//在promise里面写router

//用户管理：通过姓名搜索学生信息
app.get('/superadmin/ByName/:Byname', (req, res) => {
    let name = req.params.Byname
    // console.log(name)
    // database = ['16级学生表', '17级学生表', '18级学生表', '19级学生表', '20级学生表']
    let senior = database[0]  //大四
    let junior = database[1]  //大三
    let sophomore = database[2] //大二
    let freshman = database[3]  //大一
    const sql1 = `select * from ${senior} where 姓名="${name}"`
    const sql2 = `select * from ${junior} where 姓名="${name}"`
    const sql3 = `select * from ${sophomore} where 姓名="${name}"`
    const sql4 = `select * from ${freshman} where 姓名="${name}"`
    // console.log(sql1, sql2, sql3,sql4)
    let data = []
    let data1,
        data2,
        data3,
        data4
    //好像有不同步的bug,考虑写成嵌套db里面写db这种
    db.query(sql1, (err, rows, fields) => {
        if (err) {
            console.log(err)
            throw err
        }
        data1 = JSON.parse(JSON.stringify(rows))
        // console.log(data1)
        data1.forEach(item => {
            data.push(item)
        })
        db.query(sql2, (err, rows) => {
            if (err) {
                console.log(err)
                throw err
            }
            data2 = JSON.parse(JSON.stringify(rows))
            // console.log(data2)
            data2.forEach(item => {
                data.push(item)
            })
            db.query(sql3, (err, rows) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                data3 = JSON.parse(JSON.stringify(rows))
                // console.log(data3)
                data3.forEach(item => {
                    data.push(item)
                })
                db.query(sql4, (err, rows) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    data4 = JSON.parse(JSON.stringify(rows))
                    // console.log(data4)
                    data4.forEach(item => {
                        data.push(item)
                    })
                    // console.log(data)
                    data.forEach(element => {
                        for(let key in element) {
                            if (element[key] === null) {
                                delete element[key]
                            }
                        }
                        for (let [key, value] of Object.entries(element)) {
                            if (parseInt(key)) {
                                delete element[key]
                                key = key.slice(key.lastIndexOf('_')+1)
                                element[key] = value
                            }
                        }
                    })
                    // console.log(data) 
                    res.send({
                        status: 'OK', 
                        data: data,
                        code: 0
                    })
                })
            })
        })
    })
    // db.query(sql2, (err, rows) => {
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    //     data2 = JSON.parse(JSON.stringify(rows))
    //     // console.log(data2)
    //     data2.forEach(item => {
    //         data.push(item)
    //     })
    // })
    // db.query(sql3, (err, rows) => {
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    //     data3 = JSON.parse(JSON.stringify(rows))
    //     // console.log(data3)
    //     data3.forEach(item => {
    //         data.push(item)
    //     })
    // })
    // db.query(sql4, (err, rows) => {
    //     if (err) {
    //         console.log(err)
    //         // res.send({status: 'name fail'})
    //         return
    //     }
    //     data4 = JSON.parse(JSON.stringify(rows))
    //     // console.log(data4)
    //     data4.forEach(item => {
    //         data.push(item)
    //     })
    //     // console.log(data)
    //     data.forEach(element => {
    //         for(let key in element) {
    //             if (element[key] === null) {
    //                 delete element[key]
    //             }
    //         }
    //         for (let [key, value] of Object.entries(element)) {
    //             if (parseInt(key)) {
    //                 delete element[key]
    //                 key = key.slice(key.lastIndexOf('_')+1)
    //                 element[key] = value
    //             }
    //         }
    //     })
    //     console.log(data) 
    //     res.send({status: 'name OK', data: data})
    // })
})

//用户管理：通过学号搜索学生信息
app.get('/superadmin/ByuserId/:ById', (req, res) => {
    let id = req.params.ById
    // console.log(id)
    let sql = ''
    //未考虑转专业留级退学情况
    for (let i = 0; i < database.length; i++) {
        if (parseInt(database[i].slice(0,2)) == parseInt(id.slice(2,4))) {
            sql = `select * from ${database[i]} where 学号="${id}"`
            // console.log(sql)
        }
    }
    // let sql = `select * from 17级学生表 where 学号="${id}"`
    //条件不存在数据库中的异常处理未解决
    db.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.send({status: 'class fail'})
            return res.redirect('/')
        }
        let data = JSON.stringify(rows)
        let dataParse = JSON.parse(data)
        // console.log(dataParse)
        //如果出错应该向前台发送一个未查询到的相关信息
        if (dataParse.length > 0) {
            dataParse.forEach(element => {
                for(let key in element) {
                    if (element[key] === null) {
                        delete element[key]
                    }
                }
                for (let [key, value] of Object.entries(element)) {
                    // if ((typeof parseInt(key)) === 'number') {
                    //     console.log('is number')
                    //     console.log(parseInt(key))
                    //     console.log(typeof parseInt(key))
                    // }
                    if (parseInt(key)) {
                        delete element[key]
                        key = key.slice(key.lastIndexOf('_')+1)
                        element[key] = value
                    }
                }
            })
            // console.log(dataParse)
            res.send({
                status: 'id OK', 
                data: dataParse, 
                msg: '查询成功', 
                code: 1
            })
        } else {
            res.send({
                msg: '通过学号未找到该同学相关信息', 
                status: 'OK', 
                code: 1
            })
        }
    })
    // res.json({status: 'id OK'})
})

// 用户管理：通过班级搜索学生信息
app.get('/superadmin/ByClass/:StudentClass', (req, res) => {
    let StudentClass = req.params.StudentClass
    // console.log(StudentClass)
    //模糊匹配,先判断所在年级再判断班级
    let num = StudentClass.replace(/[^0-9]/ig,"")
    let cla = StudentClass.match(/[\u4e00-\u9fa5]/g) || ''
    // console.log(cla)
    let clas = ''
    if (cla != '') {
        cla.forEach(item => {
            if (item == '计') {
                clas = '计科'
            }
            if (item == '生' || item == '信') {
                clas = '生信'
            }
            if (item == '大' || item == '数' || item == '据') {
                clas += item
            }
        })
    } else {
        clas = `计科1704`
    }
    // console.log(clas)
    //设置默认sql查询
    // let sql = `select * from 17级学生表 where 班级 like "%${StudentClass}%"`
    let sql = ''
    let cl = clas + num
    database.forEach(item => {
        if (item.slice(0,2) == num.slice(0,2)) {
            sql = `select * from ${item} where 班级 like "%${cl}%"`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.send({status: 'class fail'})
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        // console.log(data)
        if (rows.length > 0) {
            data.forEach(element => {
                for(let key in element) {
                    if (element[key] === null) {
                        delete element[key]
                    }
                }
                for (let [key, value] of Object.entries(element)) {
                    if (parseInt(key)) {
                        delete element[key]
                        key = key.slice(key.lastIndexOf('_')+1)
                        element[key] = value
                    }
                }
            })
            // console.log(data) 
        }
        res.send({
            status: 'name OK', 
            data: data
        })
    })
    // res.json({status: 'class OK'})
})

//用户管理：通过年级搜索学生信息
app.get('/superadmin/ByGrade/:grade', (req, res) => {
    let grade = req.params.grade
    // console.log(grade)
    let num = grade.replace(/[^0-9]/ig,"")
    let sql = `select * from 16级学生表`
    // let sql = ''
    //对于数据库没有该属性列,需要怎么获取异常还没解决
    database.forEach(item => {
        if (item.slice(0,2) == num.slice(0,2)) {
            sql = `select * from ${item}`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
            res.send({status: 'grade fail'})
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        if (rows.length > 0) {
            data.forEach(element => {
                for(let key in element) {
                    if (element[key] === null) {
                        delete element[key]
                    }
                }
                for (let [key, value] of Object.entries(element)) {
                    if (parseInt(key)) {
                        delete element[key]
                        key = key.slice(key.lastIndexOf('_')+1)
                        element[key] = value
                    }
                }
            })
            // console.log(data) 
        }
        res.send({
            status: 'grade OK', 
            data: data
        })
    })
})

//用户管理：点击删除按钮删除，删除某个学生的所有信息
app.get('/superadmin/deleteStudent', (req, res) => {
    let id = req.query.id
    // console.log(id)
    // let sql = `delete from 17级学生表 where 学号="${id}"`
    let sql = ''
    database.forEach(item => {
        if (item.slice(0,2) == id.slice(2,4)) {
            sql = `delete from ${item} where 学号="${id}"`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
            throw err 
        }
        // console.log(rows)
        res.send({
            status: 'OK', 
            code: 1, 
            msg: `学号是${id}同学信息删除成功`
        })
    })
    // res.json({status: 'OK'})
})

//用户管理：编辑修改学生的信息
app.post('/superadmin/update', (req, res) => {
    let data = req.body
    // console.log(data)
    let id = data['学号']
    // console.log(id)
    let Key = ''
    let Value = ''
    for (let [key, value] of Object.entries(data)) {
        if (key != '学号') {
            Key = key
            Value = value
        }
    }
    let sql = ''
    database.forEach(item => {
        if (item.slice(0,2) == id.slice(2,4)) {
            sql = `update ${item} set ${Key}="${Value}" where 学号=${id}`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        // console.log(data)
        res.send({
            status: 'OK',
            code: 1,
            msg: '信息修改成功'
        })
    })
})

//用户管理：删除某一学生的单个活动
app.post('/superadmin/deleteSingle', (req, res) => {
    let data = req.body
    let id = data.userId
    let activity = ''
    for (let key in data) {
        if (key != 'userId') {
            activity = key
        }
    }
    // console.log(data)
    // console.log(activity)
    let SQL = ''
    let table = ''
    database.forEach(item => {
        if (item.slice(0,2) == id.slice(2,4)) {
            SQL = `select * from ${item} where 学号=${id}`
            table = item
        }
    })
    // console.log(SQL)
    // console.log(table)
    let result = []
    let activityName = ''
    db.query(SQL, (err, rows) => {
        if (err) {
            console.log(err)
            throw err
        }
        result = JSON.parse(JSON.stringify(rows))
        // console.log('result:',result)
        result.forEach(item => {
            for (let i in item) {  //存在前台活动名称与后台多个重名时怎么解决 //TOd
                if (i.slice(i.lastIndexOf('_') + 1) == activity) {
                    activityName = i
                    // console.log(activityName)
                    let sql = `update ${table} set ${activityName} = null where 学号 = ${id}`
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                            throw err
                        }
                        // console.log(rows)
                    })
                    res.json({
                        status: 'OK', 
                        msg: '信息已经被删除'
                    })
                }
            }
        })
    })
})

//用户管理：子table中的学生个人所有信息
app.get('/superadmin/obtainById', (req, res) => {
    let id = req.query.id
    // console.log(id)
    let sql = ''
    database.forEach(item => {
        if (item.slice(0,2) == id.slice(2,4)) {
            sql = `select * from ${item} where 学号=${id}`
        }
    })
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        data.forEach(element => {
            for(let key in element) {
                if (element[key] === null ) {
                    // if (key != '班级') {
                    //     delete element[key]
                    // }
                    delete element[key]
                }
            }
            for (let [key, value] of Object.entries(element)) {
                if (parseInt(key)) {
                    delete element[key]
                    key = key.slice(key.lastIndexOf('_')+1)
                    element[key] = value
                }
            }
        })
        // console.log(data) 
        res.send({
            status: 'OK',
            code: 1,
            data: data
        })
    })
    // res.json({status: 'OK'})
})

//用户管理：点击查看查询学生的所有活动加分细则
app.get('/superadmin/getPersonActivity/:id', (req, res) => {
    let id = req.params.id
    let sql = ''
    database.forEach(item => {
        if (item.slice(0,2) == id.slice(2,4)) {
            sql = `select * from ${item} where 学号=${id}`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        // console.log(data)
        let Data = []
        data.forEach(element => {
            for (let key in element) {
                if (key == '学号' || key == '姓名' || key == '班级' || key == '总分' || key == '密码') {
                    delete element[key]
                }
            }
        })
        // console.log(data)
        data.forEach(element => {
            // console.log(element)
            // let obj = {}   存在对象原型的问题，for in 里面指向了最后创建的对象
            for (let [key, value] of Object.entries(element)) {
                num = key.slice(0,key.indexOf('_'))
                // console.log(num)
                let year = num.slice(0,4)
                let month = num.slice(4,6)
                let day = num.slice(6)
                let obj = {}
                let date = year + '年' + month + '月' + day + '日'
                obj['活动'] = key.slice(key.lastIndexOf('_')+1)
                obj['分数'] = value
                obj['日期'] = date
                Data.push(obj)
            }
        })
        // console.log(Data)
        // Data.forEach(item => {
        //     // for (let o in item) {
        //     //     if (item[o] == null) {
        //     //         Data.pop(item)
        //                Data.splice(1,1)删除 splice(项的位置, 删除项的数目)
        //     //     }
        //     // }
        //     if (item['分数'] == null) {
        //         Data.pop(item)
        //     }
        // })
        //对处理的数据经行过滤，一开始用map但是map不能过滤掉特定数据会返回等长的处理操作后的数组
        let DataList = Data.filter(item => {
            // return item['分数'] != null ? item : ''
            // return (() => {
            //     if (item['分数'] != null) {
            //         return item
            //     } else {
            //         return 
            //     }
            // })
            if (item['分数'] != null) {
                return item
            }
        })
        // console.log(DataList)
        res.json({
            status: 'OK', 
            data: DataList,
            code: 1
        })
    })
})

//用户管理：点击上传excel文件
app.post('/superadmin/excelData', (req, res) => {
    let list = req.body.dataList
    let filename = req.body.name
    let num = filename.replace(/[^0-9]/ig,"")
    // console.log(filename)
    // console.log(num)
    //四个年级的,list1大四,list2大三,list3大二,list1大一,list5学号不在四个年级范围内
    let list1 = []  
    let list2 = []
    let list3 = []
    let list4 = []
    let list5 = []
    //获取数据库中学生表的年级
    let databaseList = []
    database.forEach(element => {
        databaseList.push(element.slice(0,2))
    })
    //遍历数组的for方法
    // for (let i of databaseList) {
    //     // console.log(i)
    // }
    // for (let i of databaseList.keys()) {
    //     console.log(i)
    // }
    // for (let [index, value] of databaseList.entries()) {
    //     console.log(index, value)
    // }
    //得到所有数据中的学号，判断应该插入哪一个学生表中
    let itemList = []
    list.forEach(item => {
        itemList.push(String(item['学号']).slice(2,4))
    })
    // console.log(itemList)
    //对itemList遍历判断数组中重复个数，来确定选择是创建新的表还是插入到哪个数据表中,暴力统计重复个数双重for循环
    let obje = {},
        k, arr1 = []
    for (let i = 0, len = itemList.length; i < len; i++) {
        k = itemList[i]
        if (obje[k]) {
            obje[k]++
        } else {
            obje[k] = 1
        }
    }
    // console.log(obje)
    for (let o in obje) {
        arr1.push({
            el: o,
            count: obje[o]
        })
    }
    // console.log(arr1)
    // console.log(typeof obje)
    //从大到小排序，根据出现次数最多的来选择应该插入到哪个学生表
    arr1.sort((a, b) => {
        return b.count - a.count
    })
    // console.log(arr1)
    //获取插入数据的表名
    let tableName = arr1[0].el + '级学生表'
    // console.log(tableName)
    // console.log(list)
    // list.forEach(item => {
    //     // String(item['学号'])
           //不知道为啥总出现int转string问题，我用toString()出现问题，让我很无奈直接String()强制转换了
    //     for (let [key, value] of Object.entries(item)) {
    //         if (key == '学号') {
    //             delete item[key]
    //             item[key] = String(value)
    //         }
    //     }
    // })
    //对excel表格的数据按年级进行分组
    list.forEach(element => {
        // 数据库里面只能有四张学生表也就四个年级的形式与政策信息统计表
        // console.log(typeof element['学号'])
        // String(element['学号'])
        // console.log(typeof String(element['学号']))
        if (element['学号'].toString().slice(2,4) == databaseList[0]) {
            list1.push(element)
        } else if (element['学号'].toString().slice(2,4) == databaseList[1]) {
            list2.push(element)
        } else if (element['学号'].toString().slice(2,4) == databaseList[2]) {
            list3.push(element)
        } else if (element['学号'].toString().slice(2,4) == databaseList[3]) {
            list4.push(element)
        } else {
            list5.push(element)
        }
    })
    // console.log('list1:',list1)
    // console.log('list2:',list2)
    // console.log('list3:',list3)
    // console.log('list4:',list4)
    // console.log('list5:',list5)
    //获取数据中的属性列
    let col = []
    for (let key of Object.keys(list[0])) { 
        col.push(key)
    }
    console.log(col)
    //tableName将要插入到数据库中的表名，num根据excel文件名判断数据插入到数据库中的表名，
    //list1,list2,list3,list4,list5对数据按照年级分类,col数据中属性列
    if (num != '') {
        let tableNam = String(num)+ '级学生表'
        //这样遍历database可以减少db数据库操作
        if (database.includes(tableNam)) {
            console.log(tableNam+'在数据库中')
            InsertData(tableNam)
            setTimeout(() => {
                res.send({
                    status: 'OK',
                    code: 1,
                    msg: '插入成功'
                })
            }, 1000)
        } else {
            console.log(tableNam+'不在数据库中，创建表')
            //查询数据库不存在表就创建表 
            let sql2 = `create table if not exists ${tableNam}(学号 varchar(255) not null, primary key(学号))`
            console.log(sql2)
            db.query(sql2, (err, rows) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                console.log(rows)
                //插入属性列
                for (let item of col) {
                    console.log(item)
                    if (item != '学号') {
                        let sql3 = `alter table ${tableNam} add column ${item} varchar(255)`
                        db.query(sql3, (err, rows) => {
                            if (err) {
                                console.log(err)
                                throw err
                            }
                            console.log(rows)
                            //插入数据
                            MyData(list1, tableNam)
                            MyData(list2, tableNam)
                            MyData(list3, tableNam)
                            MyData(list4, tableNam)
                            MyData(list5, tableNam)
                        })
                    }
                }
            })
            setTimeout(() => {
                res.send({
                    status: 'OK',
                    code: 1,
                    msg: '插入成功'
                })
            }, 1000)
        }
    } else {
        if (database.includes(tableName)) {
            console.log(tableName+'在数据库中')
            // console.log(col)
            InsertData(tableName)
            setTimeout(() => {
                res.send({
                    status: 'OK',
                    code: 1,
                    msg: '插入成功'
                })
            }, 1000)
        } else {
            console.log(tableName+'不在数据库中，创建表')
            let sql2 = `create table if not exists ${tableName}(学号 varchar(255) not null, primary key(学号))`
            console.log(sql2)
            db.query(sql2, (err, rows) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                console.log(rows)
                //插入属性列，如何保证按照顺序来插入数据forEach是随机遍历数组的，这个好像也是随机的
                for (let item of col) {
                    console.log(item)
                    if (item != '学号') {
                        let sql3 = `alter table ${tableName} add column ${item} varchar(255)`
                        db.query(sql3, (err, rows) => {
                            if (err) {
                                console.log(err)
                                throw err
                            }
                            console.log(rows)
                            //插入数据
                            MyData(list1, tableName)
                            MyData(list2, tableName)
                            MyData(list3, tableName)
                            MyData(list4, tableName)
                            MyData(list5, tableName)
                        })
                    }
                }
            })
            setTimeout(() => {
                res.send({
                    status: 'OK',
                    code: 1,
                    msg: '插入成功'
                })
            }, 1000)
        }
    }
    //数据库中存在当前年级学生表
    function InsertData(table) {
        // TABLE_SCHEMA = 'mark' AND
        let sql1 = `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = '${table}'`
        let tablelist = []
        db.query(sql1, (err, rows) => {
            if (err) {
                throw err
            }
            let data = JSON.parse(JSON.stringify(rows))
            //取出table表中的属性列
            data.forEach(item => {
                for (let key in item) {
                    tablelist.push(item[key])
                }
            })
            //将前台发送的数据中的键与数据库table里面的表的属性比较，返回不同的项
            let aa = col.concat(tablelist).filter((v, i, arr) => {
                return arr.indexOf(v) === arr.lastIndexOf(v)
            })
            console.log(aa)
            //比较从数据库中获取到的属性列和前台发送过来的数据中键，得到不在数据库中的属性列
            let colu = []
            aa.forEach(item => {
                if (col.includes(item)) {
                    colu.push(item)
                }
            })
            console.log(colu)
            //插入属性列
            if (colu.length != 0) {
                for (let item of colu) {
                    // console.log(item)
                    let sql2 = `alter table ${table} add column ${item} varchar(255)`
                    db.query(sql2, (err, rows) => {
                        if (err) {
                            console.log(err)
                            throw err
                        }
                        console.log(rows)
                        //插入数据
                        //根据键值对来插入数据
                        MyData(list1, table)
                        MyData(list2, table)
                        MyData(list3, table)
                        MyData(list4, table)
                        MyData(list5, table)
                    })
                }
                //colu为空说明excel属性列和数据库中属性列一致直接插入数据
            } else {
                MyData(list1, table)
                MyData(list2, table)
                MyData(list3, table)
                MyData(list4, table)
                MyData(list5, table)
            }
        })
    }
    //向数据库中对应年级的学生表插入数据
    function MyData(array, table) {
        if (array.length != 0) {
            for (let i of array) {
                let indexstring = ''
                let valuelist = []
                let mark = ''
                let id 
                //对数据处理，保证插入是按照键值对关系插入
                for (let [index, value] of Object.entries(i)) {
                    indexstring = indexstring + index.toString() + ','
                    valuelist.push(value)
                    mark = '?,' + mark
                    if (index == '学号') {
                        id = value
                    }
                }
                //获取学号，先查询table，避免出现主键重复问题
                console.log(id)
                let index = indexstring.slice(0, indexstring.length-1)
                mark = mark.slice(0, mark.length-1)
                console.log(index)
                console.log(valuelist)
                console.log(mark)
                // let sql = `insert into ${table}(${index}) values (${mark})` // (?,?,?,...)
                let sql = `insert into ${table}(${index}) values ?`
                //可以一次性插入多个数据[[arr1],[arr2],...]
                let value = []
                value.push(valuelist)
                //先查询是否存在，如果存在则删除数据，这一步其实可以省略，但是怕excel里面有两个学号一样的数据
                db.query(`select * from ${table} where 学号=${id}`, (err, rows) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    console.log(rows)
                    //如果存在则删除，之后插入
                    if (JSON.parse(JSON.stringify(rows).length != 0)) {
                        db.query(`delete from ${table} where 学号=${id}`, (err, rows) => {
                            if (err) throw err
                            //插入数据
                            db.query(sql, [value], (err, rows) => {
                                if (err) {
                                    console.log(err)
                                    throw err
                                }
                                console.log(rows)
                            })
                        })
                    } else {
                        //插入数据
                        db.query(sql, [value], (err, rows) => {
                            if (err) {
                                console.log(err)
                                throw err
                            }
                            console.log(rows)
                        })
                    }
                })
            }
        }
    }
    // MyData(list5, '20级学生表')
    // res.json({status: 'Ok'})
})

//用户管理：点击导出excel
app.get('/superadmin/getExcelData', (req, res) => {
    let information = req.query.information
    // console.log(information)
    let num = information.replace(/[^0-9]/ig,"")
    let sql = ''
    database.forEach(item => {
        if (item.slice(0,2) == num.slice(0,2)) {
            sql = `select * from ${item} where 班级 like "%${information}%"`
        }
    })
    // console.log(sql)
    db.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
            throw err
        }
        let data = JSON.parse(JSON.stringify(rows))
        res.send({
            status: 'OK', 
            data: data,
            code: 1
        })
    })
    // res.send({status: 'OK', data: data})
})

//用户管理：获取数据库中学生表信息,如何让database改变是个问题，需要重启后台
app.get('/superadmin/getStudentTable', (req, res) => {
    res.send({
        status: 'OK',
        code: 1,
        data: database
    })
})

//用户管理：删除某一年级学生信息表
app.get('/superadmin/deleteGrade/:grade', (req, res) => {
    let grade = req.params.grade
    if (database.includes(grade)) {
        let sql = `drop table if exists ${grade}`
        // console.log(sql)
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
                throw err
            }
            // console.log(rows)
            res.send({
                status: 'OK',
                code: 1,
                msg: `${grade}删除成功`
            })
        })
    } else {
        res.send({
            status: 'OK',
            code: 1,
            msg: `${grade}不在数据库中`
        })
    }
}) 

//这里是promise抛出异常的部分
}, (err) => {
    console.log(err)
})

module.exports = app  