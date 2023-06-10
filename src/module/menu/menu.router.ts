import { RouteRecordRaw } from "vue-router"
import { createChildrenRoutes } from "../../router/utils/createChildrenRoutes"
const menuRoutes = import.meta.glob('./*/*.router.ts', {
    eager: true,
    import: 'default'
  })
  
const path = '/menu'
  

export default [
    {
        path:path,
        name:'menu',
        redirect:'/menu/mainMenu',
        children:createChildrenRoutes(path,menuRoutes)
    }
]