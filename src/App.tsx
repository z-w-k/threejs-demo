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
export default defineComponent({
  setup() {
    let threeScene: ThreeScene
    let homePoints: HomePoints<ThreeScene>
    const homeContainer = ref()
    onMounted(() => {
      threeScene = new ThreeScene(homeContainer.value)
      homePoints = new HomePoints(homeContainer.value, threeScene)
      threeScene.camera.position.set(0, 2000, 1000)
      console.log(homeContainer.value.children);
      
      animate()
      window.addEventListener('resize', threeScene.onWindowResize)
    })

    const animate = () => {
      requestAnimationFrame(animate)
      threeScene.renderer.render(threeScene.scene, threeScene.camera)
      homePoints.update()
    }
    return {
      homeContainer,
    }
  },

  render() {
    return (
      <div ref='homeContainer' class='flex flex-col relative w-[100vw] h-[100vh] text-white'>
        <Header class='w-[100%] h-[10%]  border-2 absolute top-0 left-[50%] translate-x-[-50%]'/>
          <RouterView />
        <Footer class='w-[100%] h-[10%]  border-2 absolute bottom-0 left-[50%] translate-x-[-50%]'/>
      </div>
    )
  },
})
