import { RouteRecordRaw } from 'vue-router'
const moduleRoutes = import.meta.glob('../module/**/*.router.ts', {
  eager: true,
  import: 'default'
})

let childRoutes: RouteRecordRaw[] = []

Object.keys(moduleRoutes)
  .forEach(k => (childRoutes = childRoutes.concat(moduleRoutes[k as string] as RouteRecordRaw)))

console.log(childRoutes)

const routes:RouteRecordRaw[] = [
  {
    path: '/',
    redirect:'/home',
    children: childRoutes
  }
]

export default routes
