import { Button } from 'ant-design-vue'

export default defineComponent({
  props: {
    tagList: Object,
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    const bl = ref(false)
    const clickBl = () => {
      bl.value = !bl.value
    }

    const buttonList = props.tagList!.textList.map((text: string) => {
      //   const strW = '!w-['+buttonWidth.value +'%]'
      return (
        <Button
          onClick={clickBl}
          class={
            [props.tagList!.class
              ,
              ' !rounded-md !p-0 hover:!border-white !text-white !bg-transparent  !h-[100%]'
            ]
            // typeof props.buttonClass === 'string' && props.buttonClass
          }>
          {text}
        </Button>
      )
    })
    return () => (
      <div class={['border-[1px] border-red-500 flex justify-around items-center']}> {buttonList}</div>
    )
  }
})
