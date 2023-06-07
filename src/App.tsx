import { RouterView } from 'vue-router'
import { MainStore } from './store/mainStore'
import LayoutModule from './module/layout/layout'
import HomeButton from './module/home/homeButton'
export default defineComponent({
  setup() {
    const mainStore = MainStore()
    const container = ref()
    onMounted(() => {
      mainStore.init(container.value as HTMLElement)
      mainStore.animate()
    })

    const context = () => {
      return (
        <div>
          {/* <LayoutModule /> */}
          <RouterView
            class={[
              ' pointer-events-none absolute top-[50%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white'
            ]}
          />
        </div>
      )
    }

    const homeContainer = (): JSX.Element => {
      return (
        <div
          ref='container'
          class={'fixed top-[0] left-0 w-[100%] h-[100%] text-black'}>
          {!mainStore.menu ? <HomeButton /> : context()}
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
