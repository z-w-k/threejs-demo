import { flyToPosition } from '../../store/mainStore'
import { PropType } from 'vue'
import style from './menuButton.module.scss'
export interface TagList {
  textList: {
    text: string
    pathName: string
    query?: { origin: 'menu' | 'pause' }
    flyToPosition?: flyToPosition
  }[]
  class: string
}

export default defineComponent({
  props: {
    tagList: { type: Object as PropType<TagList>, required: true },
    buttonClass: String || Array
  },
  setup(props, { emit }) {
    const router = useRouter()
    const clickBl = (button: TagList['textList'][0]) => {
      if (button.text === '仓库地址')
        return window.open(button.pathName, '_blank')
      router.push({ name: button.pathName })
      router.beforeEach((to, from, next) => {
        to.query.origin = from.name as string
        next()
      })
    }

    const buttonList = props.tagList!.textList.map((button) => {
      //   const strW = '!w-['+buttonWidth.value +'%]'
      return (
        <button
          onClick={() => clickBl(button)}
          class={
            [
              style['dynamic'],
              props.tagList.class && props.tagList.class,
              '!rounded-md text-white hover:text-black  bg-transparent  h-[100%]'
            ]
            // typeof props.buttonClass === 'string' && props.buttonClass
          }>
          {button.text}
        </button>
      )
    })
    return () => (
      <div class={[' flex justify-around items-center border-2']}>
        {buttonList}
      </div>
    )
  }
})
