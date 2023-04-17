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
      console.log(isEnter)
      homePoints.addEvent(!isEnter)
    }
    const init = () => {
      threeScene = new ThreeScene(homeContainer.value)
      homePoints = new HomePoints(homeContainer.value, threeScene)
      tweenJS = new TweenJS(threeScene)
    }
    onMounted(() => {
      init()
      threeScene.camera.position.set(0, -5000, 1000)
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


    const targetPosition = {
      controlsTarget:new THREE.Vector3(500,2000,0),
      positionTarget:new THREE.Vector3(0,3000,0),
      needTime:{
        camera:1000 *3,
        controls:1000 *3,
      }
    } 

    const flyTo = ()=>{
      console.log(threeScene.controls.target);
      const tweens= tweenJS.initTween(targetPosition.controlsTarget,targetPosition.positionTarget,targetPosition.needTime)
      tweenJS.play(tweens)
    }

    const flyButton = <div class={['absolute top-0 left-0  w-[10%] h-[5%]']}>
      <Button class={['!text-white !w-[100%] !h-[100%]  !bg-transparent !border-2']} onClick={flyTo}>飞行</Button>
    </div>

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
      <Footer class='w-[100%] h-[10%]  border-2 absolute bottom-0 left-0' />
    )
    const main = (
      <RouterView
        class={[
          'absolute top-[50%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white',
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
      flyButton
    }
  },

  render() {
    return (
      <div class='relative w-[100vw] h-[100vh] text-white'>
        <div ref='homeContainer' class='fixed w-[100%] h-[100%]'>
          {this.flyButton}
          {!this.enter ? this.home : this.context}
        </div>
      </div>
    )
  },
})
