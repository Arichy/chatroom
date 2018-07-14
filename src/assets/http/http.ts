import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = `http://localhost:8080`;
axios.defaults.withCredentials = true

axios.interceptors.request.use(
    config => {
        // config.data = JSON.stringify(config.data);

        // console.log(config.data, typeof config.data);
        // config.headers = {
        //     'Content-Type': 'application/x-www-form-urlencoded' //设置跨域头部
        // };
        return config;
    },
    err => Promise.reject(err)
);

axios.interceptors.response.use(
    res => {
        return res;
    },
    err => Promise.reject(err)
);

export default axios;