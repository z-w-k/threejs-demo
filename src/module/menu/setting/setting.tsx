import { RouterView } from 'vue-router'
import MenuButton, { TagList } from '../../utils/menuButton'
export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const setting = ref()
    const from = ref('')
    const tagListSet: TagList[] = [
      {
        textList: [
          { text: '常规', pathName: 'common' },
          { text: '画面', pathName: 'graph' },
          { text: '声音', pathName: 'audio' }
        ],
        class: 'w-[100%] h-[100%] !text-2xl !font-black'
      }
    ]

    const goBack = (key: KeyboardEvent) => {
      if (key.key === 'Escape') {
        router.push({ name: from.value })
      }
    }

    onMounted(() => {
      from.value = route.query.origin as string
      window.addEventListener('keyup', goBack)
    })
    onUnmounted(() => {
      window.removeEventListener('keyup', goBack)
    })
    return {
      tagListSet,
      setting
    }
  },
  render() {
    return (
      <div
        ref='setting'
        class={['menu_container', `flex flex-col  border-2 border-red-500`]}>
        <MenuButton class={['h-[10%] w-[100%]']} tagList={this.tagListSet[0]} />
        <RouterView
          class={[
            'm-auto bg-black bg-opacity-30 h-[70%] w-[60%] flex flex-col p-[2%]'
          ]}
        />
      </div>
    )
  }
})
