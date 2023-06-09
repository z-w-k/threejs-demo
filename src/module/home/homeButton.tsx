import { MainStore } from '../../store/mainStore'
import './homeButton.css'

export default defineComponent({
  setup(props, { emit }) {
    const mainStore = MainStore()
    const click = () => {
      mainStore.requestPointerLock()
    }
    onMounted(() => {})
    return {
      click
    }
  },
  render() {
    return (
      <div
        class={[
          'absolute bottom-[10%] left-[50%] translate-x-[-50%] flex items-center justify-center text-white bg-slate-600'
        ]}>
        <button
          class={[
            'homeButton blur-sm  w-[10vw] !h-[7vh] !bg-transparent !border-2 !border-white !text-white text-2xl ',
            `hover:blur-none hover:!bg-white-400`
          ]}
          onClick={this.click}>
          开始
        </button>
      </div>
    )
  }
})
