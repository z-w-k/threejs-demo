import { createChildrenRoutes } from "../../../router/utils/createChildrenRoutes";
import setting from "./setting";


const menuRoutes = import.meta.glob('./*/*.router.ts', {
    eager: true,
    import: 'default'
  })
  
const path = '/menu/setting'
  

export default [
    {
        path:'/setting',
        name:'setting',
        redirect:'/menu/setting/common',
        component:setting,
        children:createChildrenRoutes(path,menuRoutes)
    }
]