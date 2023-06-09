import { Button } from 'ant-design-vue'
import { flyToPosition } from '../../store/mainStore';
import { PropType } from 'vue';

export interface TagList {
  textList: { text: string; path: string; flyToPosition?: flyToPosition }[]
  class: string
}


export default defineComponent({
  props: {
    tagList:{type:Object as PropType<TagList>,required: true},
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    const router = useRouter()
    const clickBl = (button: TagList['textList'][0]) => {
      if (button.text === '仓库地址') return window.open(button.path, '_blank')
      router.push(button.path)
    }

    const buttonList = props.tagList!.textList.map((button) => {
      //   const strW = '!w-['+buttonWidth.value +'%]'
      return (
        <Button
          onClick={() => clickBl(button)}
          class={
            [
              props.tagList!.class,
              ' !rounded-md !p-0 hover:!border-white !text-white !bg-transparent  !h-[100%]'
            ]
            // typeof props.buttonClass === 'string' && props.buttonClass
          }>
          {button.text}
        </Button>
      )
    })
    return () => (
      <div class={[' flex justify-around items-center']}> {buttonList}</div>
    )
  }
})
