import { RouteRecordRaw } from 'vue-router'

export const createChildrenRoutes = <T>(
  root: string,
  childrenRoutes: Record<string, unknown>
) => {
  let C_R: RouteRecordRaw[] = []

  Object.keys(childrenRoutes).forEach((k: string) => {
    const route = childrenRoutes[k as string] as RouteRecordRaw[]
    route[0].path = `${root}${route[0].path}`
    C_R = C_R.concat(route)
  })
  return C_R
}
