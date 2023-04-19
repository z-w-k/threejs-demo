import { Button } from 'ant-design-vue'

interface button{
  text:string,
  path:string
}
export default defineComponent({
  props: {
    tagList: Object,
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    const router = useRouter()

    const clickBl = (button:button) => {
      router.push(button.path)
    }

    const buttonList = props.tagList!.textList.map((button: button) => {
      //   const strW = '!w-['+buttonWidth.value +'%]'
      return (
        <Button
          onClick={()=>clickBl(button)}
          class={
            [props.tagList!.class
              ,
              ' !rounded-md !p-0 hover:!border-white !text-white !bg-transparent  !h-[100%]'
            ]
            // typeof props.buttonClass === 'string' && props.buttonClass
          }>
          {button.text}
        </Button>
      )
    })
    return () => (
      <div class={['border-[1px] border-red-500 flex justify-around items-center']}> {buttonList}</div>
    )
  }
})
