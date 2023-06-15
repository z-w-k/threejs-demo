import MenuButton, { TagList } from '../../utils/menuButton'

export default defineComponent({
  props: {},
  setup(props, { emit }) {
    let interval: number
    const router = useRouter()
    const route = useRoute()
    const tagListSet: TagList[] = [
      {
        textList: [
          { text: '帮助', pathName: 'help' },
          { text: '设置', pathName: 'setting' },
          { text: '返回主菜单', pathName: 'menu' }
        ],
        class: 'w-[100%] h-[20%] hover:text-black  !text-2xl !font-black'
      }
    ]

    const continuePlay = (key: KeyboardEvent) => {
      if (route.name !== 'pause') return
      if (key.key === 'Escape') {
        const lockIntercal = Date.now() - interval
        if (lockIntercal < 1200) return handleKeyup()
        router.push({ name: route.meta.fixedRoute as string })
      }
    }

    const handleKeyup = () => {
      window.addEventListener('keyup', continuePlay, { once: true })
    }
    onMounted(() => {
      console.log(route)

      interval = Date.now()
      handleKeyup()
    })

    return {
      tagListSet
    }
  },
  render() {
    return (
      <div class={['menu_container']}>
        <MenuButton
          class={[
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex-col h-[40%] w-[15%]'
          ]}
          tagList={this.tagListSet[0]}
        />
      </div>
    )
  }
})
