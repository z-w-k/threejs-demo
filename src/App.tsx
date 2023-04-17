import {
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
export default defineComponent({
  setup() {
    let threeScene: ThreeScene
    let homePoints: HomePoints
    const enter = ref<boolean>(false)
    const homeContainer = ref()
    const btIsEnter = (isEnter: boolean) => {
      enter.value = isEnter
      console.log(isEnter)
      homePoints.addEvent(!isEnter)
    }
    onMounted(() => {
      threeScene = new ThreeScene(homeContainer.value)
      homePoints = new HomePoints(homeContainer.value, threeScene)
      // threeScene.camera.position.set(0, 2000, 1000)
      console.log(homeContainer.value.children)

      animate()
      window.addEventListener('resize', threeScene.onWindowResize)
    })

    const animate = () => {
      requestAnimationFrame(animate)
      threeScene.renderer.render(threeScene.scene, threeScene.camera)
      homePoints.update()
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
