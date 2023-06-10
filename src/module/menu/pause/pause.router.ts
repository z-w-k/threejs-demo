import setting from '../setting/setting'
import pause from './pause'

export default [
  {
    path: '/pause',
    name: 'pause',
    component: pause
  },
  {
    path: '/pause/setting',
    name: 'pauseSetting',
    component: setting
  }
]
