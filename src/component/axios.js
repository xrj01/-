import axios from "axios";
import {message} from "antd";
import {createHashHistory} from "history";
const history = createHashHistory();
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(response.data.code == -1006){
        message.error("登录过期,请重新登录");
        history.push("/")
    }
    if(response.data.code !== 1 && !response.status){
        message.error(response.data.msg);
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

const Axios=(url,data,type,form)=>{
    const token = sessionStorage.getItem("token");
    const config={
        url:url,
        method: type
    };
    if(form){
        config.headers={ 'Content-Type': 'multipart/form-data' }
    }else{
        config.headers={ 'Content-Type': 'application/json;charset=UTF-8'}
        if(token){ config.headers["buyer_token"]=token }
    }
    if(type == "post"){ config.data=data }
    if(type == "get" && data){ config.params= data }
    return axios(config);
};
export default Axios;