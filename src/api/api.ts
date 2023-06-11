import { OnDownloadProgress } from "../store/mainStore";
import request  from "./http";
import { apiUrl } from "./url";

export const API = {
    getModel:()=>{
        return request.get(apiUrl.getModel)
    }
}