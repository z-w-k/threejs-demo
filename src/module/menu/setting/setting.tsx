import { RouterView } from 'vue-router'
import MenuButton from '../../utils/menuButton'

export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const setting = ref()
    const tagListSet = [
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
        if(router.currentRoute.value.fullPath.includes('menu')){
          router.push({name:'menu'})
        }else{
          router.push({name:'pause'})
        }
      }
    }
    onUnmounted(() => {
      window.removeEventListener('keyup', goBack)

    })

    onMounted(() => {
      window.addEventListener('keyup', goBack)
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
        class={[
          'relative flex flex-col h-[100%] w-[100%] border-2 border-red-500 bg-opacity-30 bg-black'
        ]}>
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
