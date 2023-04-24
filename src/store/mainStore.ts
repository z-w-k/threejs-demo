import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import { Scene, Vector3 } from 'three'
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
  enterPosition: FlyToPosition,
  heatMap :FlyToPosition,
  // homePosition:FlyToPosition,
}

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  let homePoints!: HomePoints
  let tweenJS!: TweenJS
  let temp!: TemperatureField
  const container = ref()
  const enter = ref(false)
  const utilSet: Ref<UtilSet> = ref({})
  const scenePosition: Ref<ScenePosition> = ref({
    heatMap: new FlyToPosition([900, 900, 900], [600, 1000, 600], [1, 1]),
    // homePosition: new FlyToPosition([1, 0, 0], [-2000, -2000, -2000], [2, 2]),
    enterPosition: new FlyToPosition([0, 0, 0], [800, 800, 800], [.5, .5])
  })

  const init = (homeContainer: HTMLElement) => {
    container.value = homeContainer
    threeScene = new ThreeScene(homeContainer)
    homePoints = new HomePoints(homeContainer, threeScene)
    tweenJS = new TweenJS(threeScene)
    temp = new TemperatureField(threeScene)
    utilSet.value.threeScene = threeScene
    utilSet.value.homePoints = homePoints
    utilSet.value.tweenJS = tweenJS
    utilSet.value.temp = temp
    // const box = new THREE.Mesh(new THREE.BoxGeometry(1000,1000,1000),new THREE.MeshBasicMaterial({color:'white'}))
    // threeScene.scene.add(box)
    threeScene.camera.position.set(600, 400, 600)
    threeScene.controls.target.set(1, 0, 0)
    threeScene.controls.update()
    window.addEventListener('resize', threeScene.onWindowResize)
  }

  const flyTo = (positionName: keyof ScenePosition) => {
    const position = scenePosition.value[positionName]
    tweenJS.flyTo(position)
    return position as FlyToPosition
  }

  const btIsEnter = (isEnter: boolean) => {
    enter.value = isEnter
    const target = isEnter ? 'enterPosition' : 'homePosition'
    flyTo(target as keyof ScenePosition) 
  }

  const animate = () => {
    requestAnimationFrame(animate)
    threeScene.renderer.render(threeScene.scene, threeScene.camera)
    homePoints.update()
    tweenJS.tween.update()
    threeScene.controls.update()
    
  }

  return { utilSet, enter, init, animate, btIsEnter, flyTo }
})

export const HomeStore = defineStore('homeStore', () => {})
