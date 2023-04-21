import { Button } from 'ant-design-vue'
import { MainStore, TagList } from '../../store/mainStore'

export default defineComponent({
  props: {
    tagList:Object as PropType<TagList>,
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    
    const mainStore = MainStore()
    const router = useRouter()

    const clickBl = (button:TagList['textList'][0]) => {
      console.log(button);
      router.push(button.path)
      button.flyToPosition && mainStore.utilSet.tweenJS?.flyTo(button.flyToPosition)
    }

    const buttonList = props.tagList!.textList.map((button) => {
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
