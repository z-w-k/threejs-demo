import { RouteRecordRaw } from 'vue-router'
const moduleRoutes = import.meta.glob('../module/**/*.router.ts', {
  eager: true,
  import: 'default'
})

let childRoutes: RouteRecordRaw[] = []

Object.keys(moduleRoutes)
  .forEach(k => (childRoutes = childRoutes.concat(moduleRoutes[k as string] as RouteRecordRaw)))


const routes:RouteRecordRaw[] = [
  {
    path: '/',
    redirect:'/mainMenu',
    children: childRoutes
  }
]

export default routes
