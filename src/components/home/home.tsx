import { Button } from 'ant-design-vue'
import { RouterLink } from 'vue-router'


export default defineComponent({
  props:{
    isEnter:ref<Boolean>,
    onGetEnter:{
      type:Function
    }
  },
  setup(props, {emit}) {

    const click = (e: MouseEvent) => {
      emit('GetEnter', !props.isEnter!.value)
    }
    onMounted(()=>{
      console.log(props.isEnter!.value)
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
          'absolute bottom-[10%] left-[50%] translate-x-[-50%] flex items-center justify-center text-white',
        ]}>
        <Button class={[' blur-md  w-[10vw] !h-[7vh] !bg-transparent !border-2 !border-white !text-white',`hover:blur-none` ]} onClick={this.click}>
          首页
        </Button>
      </div>
    )
  },
})
