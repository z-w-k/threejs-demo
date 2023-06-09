import { OnDownloadProgress } from "../store/mainStore";
import request  from "./http";
import { apiUrl } from "./url";

export const API = {
    getModel:(onDownloadProgress:OnDownloadProgress)=>{
        return request.get(apiUrl.getModel,{onDownloadProgress:onDownloadProgress})
    }
}