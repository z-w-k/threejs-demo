import { RouteRecordRaw } from 'vue-router'
import heatMap from './heatMap'

const route:RouteRecordRaw[] = [
  {
    name: 'heatMap',
    path: '/heatMap',
    component: heatMap
  }
]

export default route
