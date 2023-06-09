import axios from "axios";

const request = axios.create({
    timeout:1000*5,
    
})
request.interceptors.request.use((config)=>{
    console.log(config);

    return config
},err=>{
    return Promise.reject(err)
})

request.interceptors.response.use(response=>{

    return response
},err=>{
    return Promise.reject(err)
})

export default request