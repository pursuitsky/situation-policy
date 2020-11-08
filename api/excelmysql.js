var excel2mysql = require('excel2mysql')
var excelPath = './data.xlsx'

excel2mysql({
    input: excelPath,
    model: 'create',
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'new_password',
        database: 'excel'
    }
}, function (err, sql, result) {
    err && console.error(err)
    sql && console.log(sql.sql)
    result && console.log(result)
})