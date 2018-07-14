export const setTimeoutPromise: Function = (timeout: number, data?: any) => new Promise((resolve: Function, reject?: Function) => {
    setTimeout(() => {
        resolve(data);
    }, timeout);
});