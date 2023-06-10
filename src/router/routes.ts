import { RouteRecordRaw } from 'vue-router'
import { createChildrenRoutes } from './utils/createChildrenRoutes'
const moduleRoutes = import.meta.glob('../module/*/*.router.ts', {
  eager: true,
  import: 'default'
})

const routes:RouteRecordRaw[] = [
  {
    path: '/',
    redirect:'/menu',
    children: createChildrenRoutes('',moduleRoutes)
  }
]

export default routes
