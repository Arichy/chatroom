const setTimeoutPromise: Function = (timeout: number, data?: any) => new Promise((resolve: Function, reject?: Function) => {
    setTimeout(() => {
        resolve(data);
    }, timeout);
});

function setCookie(name:string, value:any, days?:number):void {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name:string):any {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function deleteCookie(name:string):void {
    document.cookie = name + '=; Max-Age=-99999999;';
}

export {
    setTimeoutPromise,
    setCookie,
    getCookie,
    deleteCookie
}