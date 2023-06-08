import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import { Vector3 } from 'three'
import TemperatureField from '../util/temperature'

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

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  let homePoints!: HomePoints
  let tweenJS!: TweenJS
  let temp!: TemperatureField
  const container = ref()

  const menu = ref(false)
  const utilSet: Ref<UtilSet> = ref({})
  const scenePosition: Ref<ScenePosition> = ref({
    heatMap: new FlyToPosition([0, -2200, 0], [0, -2000, 20], [1, 1]),
    // homePosition: new FlyToPosition([1, 0, 0], [-2000, -2000, -2000], [2, 2]),
    enterPosition: new FlyToPosition([0, 0, 0], [0, 0, 5], [1, 1]),
    points: new FlyToPosition([0, -1000, 0], [0, -1000, 20], [1, 1])
  })

  const init = (homeContainer: HTMLElement) => {
    container.value = homeContainer
    threeScene = new ThreeScene(homeContainer,{ fov: 60, near: 0.1, far: 1500 })
    // homePoints = new HomePoints(homeContainer, threeScene)
    tweenJS = new TweenJS(threeScene)
    temp = new TemperatureField(threeScene)
    utilSet.value.threeScene = threeScene
    utilSet.value.homePoints = homePoints
    utilSet.value.tweenJS = tweenJS
    utilSet.value.temp = temp
    // const box = new THREE.Mesh(new THREE.BoxGeometry(1000,1000,1000),new THREE.MeshBasicMaterial({color:'white'}))
    // threeScene.scene.add(box)
    threeScene.camera.position.set(0, 0, 5)
    threeScene.controls.target.set(0, 0, 0)
    threeScene.controls.update()

    document.addEventListener('pointerlockchange', (e) => {
      if (document.pointerLockElement) {
        console.log('锁定')
        threeScene.enterFps()
      } else {
        console.log('取消锁定')
        threeScene.enterOrbit()
        setTimeout(() => btIsEnter(false), 1000)
      }
    })
    window.addEventListener('resize', threeScene.onWindowResize)
  }

  const flyTo = (positionName: keyof ScenePosition) => {
    const position = scenePosition.value[positionName]
    tweenJS.flyTo(position)
    return position as FlyToPosition
  }

  const btIsEnter = (isEnter: boolean) => {
    if (isEnter) {
      document.body.requestPointerLock()
    }
    menu.value = isEnter
    console.log('立即')

    // const target = isEnter ? 'enterPosition' : 'homePosition'
    // flyTo(target as keyof ScenePosition)
  }

  let animateId
  const animate = () => {
    // tweenJS.tween.update()
    // homePoints.update()
    threeScene.animate()
    animateId = requestAnimationFrame(animate)
  }

  return { utilSet, menu, init, animate, btIsEnter, flyTo }
})

export const HomeStore = defineStore('homeStore', () => {})
