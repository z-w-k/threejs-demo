import { RouterView } from 'vue-router'
import { MainStore } from './store/mainStore'
import './assets/css/app.scss'
import { KeepAlive, Transition, resolveDynamicComponent } from 'vue'
export default defineComponent({
  setup() {
    const mainStore = MainStore()
    const container = ref()
    const route = useRoute()
    onMounted(() => {
      mainStore.init(container.value as HTMLElement)
      mainStore.animate()
    })
    const getSlot = (component: any) => {
      return (
        <div class={[`fixed top-0 left-0 h-[100vh] w-[100vw] text-white`]}>
          <Transition name='fade' mode='out-in'>
            {resolveDynamicComponent(component.Component)}
          </Transition>
        </div>
      )
    }
    return {
      container,
      getSlot
    }
  },

  render() {
    return (
      <div ref='container' class='relative w-[100vw] h-[100vh]'>
        <RouterView v-slots={this.getSlot} />
      </div>
    )
  }
})
