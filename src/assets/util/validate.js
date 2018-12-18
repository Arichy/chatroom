// 用户名只能为字母、数字、汉字 由于不会正则所以用函数
let usernameAuth = str =>
    !Array.from(str)
        .map(
            char =>
                char.match(passwordReg) == null &&
                !(char >= "\u4e00" && char <= "\u9fa5")
        )
        .reduce((a, b) => a || b, false);

// 密码只能为字母和数字
let passwordReg = /^[A-Za-z0-9]+$/g;

// 验证用户名和密码
export function vuser_pass(username, password) {
    let msg = '';
    let type = '';

    if (username.length == 0 || password.length == 0) {
        msg = "用户名和密码不能为空";
        type = "error";

        return { msg, type };
    }

    if (username.length > 10 || password.length > 10) {
        msg = "用户名和密码不能超过10位";
        type = "error";

        return { msg, type };
    }

    if (!usernameAuth(username) || password.match(passwordReg) == null) {
        msg = "用户名或密码含有非法字符";
        type = "error";

        return { msg, type };
    }

    return { msg, type };
}

// 验证创建房间的房间名
export function vroomname(roomname) {

    let errMsg = '';

    if (roomname == null || roomname.length == 0) {
        errMsg = '房间名不能为空';
        return errMsg;
    }

    if (roomname.length > 10) {
        errMsg = '房间名不能超过10个字符';
        return errMsg;
    }

    if (!usernameAuth(roomname)) {
        errMsg = '房间名含非法字符';
        return errMsg;
    }

    return true;
}
