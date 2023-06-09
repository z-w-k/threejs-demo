import { RouterView } from 'vue-router'
import { MainStore } from './store/mainStore'
import LayoutModule from './module/layout/layout'
import './assets/css/app.css'
import { Transition } from 'vue'
export default defineComponent({
  setup() {
    const mainStore = MainStore()
    const container = ref()
    const route = useRoute()
    console.log(route)

    onMounted(() => {
      mainStore.init(container.value as HTMLElement)
      mainStore.animate()
    })

    const Context = () => {
      return (
        <div>
          {route.name !== 'mainMenu' && <LayoutModule />}
          <Transition name='billet' mode='out-in' appear>
            <RouterView
              class={[
                `absolute top-[50%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white`,
                `${route.name === 'mainMenu' && 'h-[100%]!important  bg-opacity-30 bg-black'}`
              ]}
            />
          </Transition>
        </div>
      )
    }

    const homeContainer = (): JSX.Element => {
      return (
        <div
          ref='container'
          class={'fixed top-[0] left-0 w-[100%] h-[100%] text-black'}>
          <Context />
        </div>
      )
    }

    return {
      homeContainer,
      container
    }
  },

  render() {
    return (
      <div class='relative w-[100vw] h-[100vh] text-black'>
        {this.homeContainer()}
      </div>
    )
  }
})
