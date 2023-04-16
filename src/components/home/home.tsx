import { Button } from 'ant-design-vue'
import { RouterLink } from 'vue-router'

interface Props {
  isEnter: boolean
}

export default defineComponent({
  setup(props: Props, ctx) {

    const click = (e: MouseEvent) => {
      ctx.emit('getEnter', !props.isEnter)
    }
    onMounted(()=>{
      console.log(props.isEnter)
    })
    return {
      click,
    }
  },
  render() {
    // console.log(this.isEn
    return (
      <div
        class={[
          'absolute top-[30%] left-[0] translate-y-[-50%] h-[80%] w-[100%] flex items-center justify-center text-white',
        ]}>
        <Button class={[]} onClick={this.click}>
          首页
        </Button>
      </div>
    )
  },
})
