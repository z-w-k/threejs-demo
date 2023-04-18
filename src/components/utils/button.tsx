import { Button } from 'ant-design-vue'

export default defineComponent({
  props: {
    tagList: Array,
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    const buttonWidth = Math.floor((100 / props.tagList!.length) )
    console.log(buttonWidth)

    const bl = ref(false)
    const clickBl = ()=>{
        bl.value =!bl.value
    }

    const buttonList = props.tagList!.map((text) => {
    //   const strW = '!w-['+buttonWidth.value +'%]'
      const strW = '!w-['+buttonWidth +'%]'
      console.log(strW);
      return (
        <Button
        onClick={clickBl}
          class={
            [strW
            , ' !rounded-md !p-0 hover:!border-white !text-white !bg-transparent  !h-[100%]']
            // typeof props.buttonClass === 'string' && props.buttonClass
          }>
          {text}
        </Button>
      )
    })
    return () => (
      <div class={['border-[1px] border-red-500 flex']}> {buttonList}</div>
    )
  }
})
