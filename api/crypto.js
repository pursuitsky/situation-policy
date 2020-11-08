const crypto = require('crypto')

//加密数据
let Encrypt = (data, key) => {
        const cipher = crypto.createCipher('aes-128-cbc', key);        
        let encrypted = cipher.update(data, 'utf8', 'hex');        
        encrypted += cipher.final('hex')
    return encrypted
}

//解密数据
let Decrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher('aes-128-cbc', key)
    //utf8方式加密
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

//生成加密算法的key
let Random = (Min, Max) => {
    let Range = Max - Min
    let Rand = Math.random()
    if (Math.round(Rand * Range) == 0) {
        return Min + 1
    }
    let num = Min + Math.round(Rand * Range)
    return num
}

let RandomNum = Random(1000, 9999)
const key = RandomNum.toString()


function AESEncrypt(data) {
    let encrypted = Encrypt(data, key)
    return encrypted
}

function AESDecrypt(encrypted) {
    let decrypted = Decrypt(encrypted, key)
    return decrypted
}

module.exports = {
    AESEncrypt,
    AESDecrypt
}