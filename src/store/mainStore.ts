import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'

interface UtilSet {
  threeScene?:ThreeScene
  homePoints?:HomePoints
  tweenJS?:TweenJS
}

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  let homePoints!: HomePoints
  let tweenJS!: TweenJS
  const test = ref('pinia加载完成')
  const container = ref()
  const enter = ref(false)
  const utilSet:Ref<UtilSet> = ref({})
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
    threeScene.camera.position.set(2000, -2000, -2000)
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

  return { utilSet,enter,init,animate,btIsEnter }
})

export const HomeStore = defineStore('homeStore', () => {

  
})
