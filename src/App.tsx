import {
  Button,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
} from 'ant-design-vue'
import { RouterView } from 'vue-router'
import ThreeScene from './util/ThreeScene'
import HomePoints from './util/homePoints'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Home from './components/home/home'
import TweenJS from './util/tween'
import * as THREE from 'three'
export default defineComponent({
  setup() {
    let threeScene: ThreeScene
    let homePoints: HomePoints
    let tweenJS: TweenJS
    const enter = ref<boolean>(false)
    const homeContainer = ref()
    const btIsEnter = (isEnter: boolean) => {
      enter.value = isEnter
      const target = isEnter ? 'targetPosition' : 'homePosition'
      tweenJS.flyTo(target)
    }
    const init = () => {
      threeScene = new ThreeScene(homeContainer.value)
      homePoints = new HomePoints(homeContainer.value, threeScene)
      tweenJS = new TweenJS(threeScene)
      // const box = new THREE.Mesh(new THREE.BoxGeometry(1000,1000,1000),new THREE.MeshBasicMaterial({color:'white'}))
      // threeScene.scene.add(box)
    }
    onMounted(() => {
      init()
      threeScene.camera.position.set(2000, -2000, -2000)
      threeScene.controls.target.set(1,0,0)
      threeScene.controls.update()
      animate()
      window.addEventListener('resize', threeScene.onWindowResize)
    })

    const animate = () => {
      requestAnimationFrame(animate)
      threeScene.renderer.render(threeScene.scene, threeScene.camera)
      homePoints.update()
      tweenJS.tween.update()
      threeScene.controls.update()
    }



    const home = (
      <Home class={[' z-10']} onGetEnter={btIsEnter} isEnter={enter} />
    )
    const header = (
      <Header
        onHomeIndex={btIsEnter}
        isHomeIndex={enter}
        class='w-[100%] h-[10%]  border-2 absolute top-0 left-[50%] translate-x-[-50%]'
      />
    )
    const footer = (
      <Footer class='pointer-events-none none w-[100%] h-[10%]  border-2 absolute bottom-0 left-0' />
    )
    const main = (
      <RouterView
        class={[
          ' pointer-events-none absolute top-[50%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white',
        ]}
      />
    )
    const context = [header, main, footer]
    return {
      homeContainer,
      enter,
      btIsEnter,
      home,
      context,
    }
  },

  render() {
    return (
      <div class='relative w-[100vw] h-[100vh] text-white'>
        <div ref='homeContainer' class='fixed w-[100%] h-[100%]'>
          {!this.enter ? this.home : this.context}
        </div>
      </div>
    )
  },
})
