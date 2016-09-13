/**
 * 身份验证处理，当验证失败的时候，callback（err）
 * Created by j0 on 2016/9/13.
 */
module.exports = function (token, socket, callback) {
    if (token.startsWith('test')) {
        callback(null,null)
        return
    }
    callback(new Error('auth error'))
}