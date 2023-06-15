import { MainStore } from '../../store/mainStore'

export default defineComponent({
  setup(props, ctx) {
    const mainStore = MainStore()
    const debugUI = ref()

    onMounted(() => {
      mainStore.utilSet.threeScene?.enterOrbit()
      window.addEventListener(
        'keyup',
        (key: KeyboardEvent) => {
          if (key.key === 'Escape') {
            mainStore.pause()
          }
        },
        { once: true }
      )
    })
    return {
      debugUI
    }
  },
  render() {
    return (
      <div
        ref='debugUI'
        class={['pointer-events-none h-[100%] w-[100%]']}></div>
    )
  }
})
