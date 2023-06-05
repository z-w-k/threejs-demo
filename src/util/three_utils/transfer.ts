import ThreeScene from '../ThreeScene'
import { ThreeBaseApi } from './baseAPI'

export function propsTransfer<T extends ThreeBaseApi>(
  targetThis: T,
  originThis: ThreeScene,
  TO: Array<keyof ThreeBaseApi>
): void {
  TO.forEach(key => {
    (<any>targetThis)[key] = originThis[key]
  })
}
