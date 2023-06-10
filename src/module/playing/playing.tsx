import { MainStore } from '../../store/mainStore'

export default defineComponent({
  setup(props, ctx) {
    const mainStore = MainStore()
    const UI = ref()
    onMounted(() => {
      mainStore.requestPointerLock()
      UI.value.addEventListener('click', () => {
        mainStore.requestPointerLock()
      })
    })
    return {
      UI
    }
  },
  render() {
    return <div ref='UI' class={['h-[100%] w-[100%]']}></div>
  }
})
