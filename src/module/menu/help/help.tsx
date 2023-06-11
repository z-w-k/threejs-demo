import './help.scss'
export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const goBack = (key: KeyboardEvent) => {
      if (key.key === 'Escape') {
        router.push({ name: route.query.origin as string })
        console.log(`route:`, route)
        console.log(`router:`, router)
      }
    }

    onMounted(() => {
      window.addEventListener('keyup', goBack)
    })
    onUnmounted(() => {
      window.removeEventListener('keyup', goBack)
    })
    return {}
  },
  render() {
    return (
      <div class={['menu_container', 'flex']}>
        <div
          class={[
            ' p-[5%] flex flex-col bg-black bg-opacity-70 w-[50%] h-[70%] m-auto'
          ]}>
          <div class={['m-auto']}>github</div>
          <div class={['w-[100%] h-[50%] flex text-2xl font-bold']}>
            <div class={'w-[30%]'}>send to me</div>
            <div class={['sendToMeDiv', 'flex-1']}>
              <input class={['sendToMe', 'h-[100%] w-[100%]']} />
              <span class='bottom'></span>
              <span class='right'></span>
              <span class='top'></span>
              <span class='left'></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
