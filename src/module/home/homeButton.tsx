import { Button } from 'ant-design-vue'
import { MainStore } from '../../store/mainStore'

export default defineComponent({
  setup(props, { emit }) {
    const mainStore = MainStore()
    const click = () => {
      console.log(mainStore.enter)
      mainStore.enter = true
      mainStore.utilSet.tweenJS?.flyTo("targetPosition")
      
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
          'absolute bottom-[10%] left-[50%] translate-x-[-50%] flex items-center justify-center text-white'
        ]}>
        <Button
          class={[
            ' blur-sm  w-[10vw] !h-[7vh] !bg-transparent !border-2 !border-white !text-white',
            `hover:blur-none hover:!bg-blue-400`
          ]}
          onClick={this.click}>
          首页
        </Button>
      </div>
    )
  }
})
