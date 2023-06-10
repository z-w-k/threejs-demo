import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import { Vector3 } from 'three'
import TemperatureField from '../util/temperature'
import _ from 'lodash'

interface UtilSet {
  threeScene?: ThreeScene
  homePoints?: HomePoints
  tweenJS?: TweenJS
  temp?: TemperatureField
}

export interface flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: {
    camera: number
    controls: number
  }
}

class FlyToPosition implements flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: flyToPosition['needTime'] = { camera: 0, controls: 0 }
  constructor(
    controlsTarget: number[],
    positionTarget: number[],
    needTime: number[]
  ) {
    this.controlsTarget = new Vector3(...controlsTarget)
    this.positionTarget = new Vector3(...positionTarget)
    this.needTime.camera = needTime[0]
    this.needTime.controls = needTime[1]
  }
}

export interface ScenePosition {
  enterPosition: FlyToPosition
  heatMap: FlyToPosition
  // homePosition:FlyToPosition,
}
export type OnDownloadProgress = (e: any) => void

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  const isMask = ref(false)
  const utilSet: Ref<UtilSet> = ref({})
  const router = useRouter()
  const scenePosition: Ref<ScenePosition> = ref({
    heatMap: new FlyToPosition([0, -2200, 0], [0, -2000, 20], [1, 1]),
    // homePosition: new FlyToPosition([1, 0, 0], [-2000, -2000, -2000], [2, 2]),
    enterPosition: new FlyToPosition([0, 0, 0], [0, 0, 5], [1, 1]),
    points: new FlyToPosition([0, -1000, 0], [0, -1000, 20], [1, 1])
  })

  const init = (homeContainer: HTMLElement) => {
    threeScene = new ThreeScene(homeContainer, {
      fov: 60,
      near: 0.1,
      far: 1500
    })
    utilSet.value.tweenJS  = new TweenJS(threeScene)
    utilSet.value.temp = new TemperatureField(threeScene)
    lockMouse()
    utilSet.value.threeScene = threeScene

  const resize = _.debounce(threeScene.onWindowResize,100)
    window.addEventListener('resize', resize)
  }

  const lockMouse = () => {
    document.addEventListener('pointerlockchange', (e) => {
      if (document.pointerLockElement) {
        console.log('锁定')
        threeScene.enterFps()
      } else {
        console.log('取消锁定')
        threeScene.enterOrbit()
        router.push({name:'pause'})
      }
    })
  }

  const onDownloadProgress: OnDownloadProgress = (e) => {
    console.log(e, 1)
  }

  const flyTo = (positionName: keyof ScenePosition) => {
    const position = scenePosition.value[positionName]
    utilSet.value.tweenJS!.flyTo(position)
    return position as FlyToPosition
  }

  const requestPointerLock = () => {
    try {
      document.body.requestPointerLock()
      
    } catch (error) {
      console.log(error);
      
    }
  }

  let animateId
  const animate = () => {
    // tweenJS.tween.update()
    // homePoints.update()
    threeScene.animate()
    animateId = requestAnimationFrame(animate)
  }

  return {
    utilSet,
    isMask,
    init,
    animate,
    requestPointerLock,
    flyTo,
    onDownloadProgress
  }
})

export const HomeStore = defineStore('homeStore', () => {})
