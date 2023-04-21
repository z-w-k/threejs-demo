import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import { flyToPosition } from '../util/tween'
import { Vector3 } from 'three'

interface UtilSet {
  threeScene?:ThreeScene
  homePoints?:HomePoints
  tweenJS?:TweenJS
}

export interface TagList {
  textList: { text:string; path: string; flyToPosition?: FlyToPosition }[]
  class: string
}

class FlyToPosition implements flyToPosition{
  controlsTarget:Vector3
  positionTarget:Vector3
  needTime:flyToPosition['needTime']={camera:0,controls:0}
  constructor(controlsTarget:number[],positionTarget:number[], needTime:number[]){
    this.controlsTarget = new Vector3(...controlsTarget)
    this.positionTarget = new Vector3(...positionTarget)
    this.needTime.camera = needTime[0]
    this.needTime.controls = needTime[1]
  }
}


export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  let homePoints!: HomePoints
  let tweenJS!: TweenJS
  const test = ref('pinia加载完成')
  const container = ref()
  const enter = ref(false)
  const utilSet:Ref<UtilSet> = ref({})
  let tagList: TagList[] = [
    {
      textList: [
        { text: '热力图', path: '/heatMap', flyToPosition: new FlyToPosition([800,800,800],[700,700,700],[1,1]) },
        { text: 'ThreeOS Z', path: '' },
        { text: 'Integrations', path: '' },
        { text: 'TZ ID', path: '' }
      ],
      class:
        '!w-[23%] !h-[50%] hover:!bg-[#fff] hover:!text-black hover:!h-[60%]'
    },
    {
      textList: [
        { text: 'Launch ThreeOS Z', path: '' },
        { text: 'Hub', path: '' }
      ],
      class: `!w-[45%] !h-[70%] !bg-[#0df6ff] hover:!bg-pink-400 !text-black hover:!h-[80%]`
    }
  ]
  const init = (homeContainer:HTMLElement) => {
    container.value = homeContainer
    threeScene = new ThreeScene(homeContainer)
    homePoints = new HomePoints(homeContainer, threeScene)
    tweenJS = new TweenJS(threeScene)
    utilSet.value.threeScene = threeScene
    utilSet.value.homePoints = homePoints
    utilSet.value.tweenJS = tweenJS
    // const box = new THREE.Mesh(new THREE.BoxGeometry(1000,1000,1000),new THREE.MeshBasicMaterial({color:'white'}))
    // threeScene.scene.add(box)
    threeScene.camera.position.set(400, -400, -400)
    threeScene.controls.target.set(1, 0, 0)
    threeScene.controls.update()
    window.addEventListener('resize', threeScene.onWindowResize)
  }

  const btIsEnter = (isEnter: boolean) => {
    enter.value = isEnter
    const target = isEnter ? 'targetPosition' : 'homePosition'
    tweenJS.flyTo(target)
  }

  const animate = () => {
    requestAnimationFrame(animate)
    threeScene.renderer.render(threeScene.scene, threeScene.camera)
    homePoints.update()
    tweenJS.tween.update()
    threeScene.controls.update()
  }

  return { tagList,utilSet,enter,init,animate,btIsEnter }
})

export const HomeStore = defineStore('homeStore', () => {

  
})
