import { Vector3 } from 'three'
import ButtonList, { TagList } from '../../utils/menuButton'
import { MainStore, flyToPosition } from '../../../store/mainStore'

export default defineComponent({
  setup(props, { emit }) {
    const mainStore = MainStore()
    const router = useRouter()
    let tagList: TagList[] = [
      {
        textList: [
          { text: '热力图', pathName: '/heatMap' },
          { text: '粒子系统', pathName: '/points' },
          { text: '实现中...', pathName: '' },
          { text: '实现中...', pathName: '' }
        ],
        class:
          '!w-[23%] !h-[50%] hover:!bg-[#fff] hover:!text-black hover:!h-[60%]'
      },
      {
        textList: [
          { text: '...', pathName: '' },
          {
            text: '仓库地址',
            pathName: 'https://github.com/1099571219/threejs-demo'
          }
        ],
        class: `!w-[45%] !h-[70%] !bg-[#0df6ff] hover:!bg-pink-400 !text-black hover:!h-[80%]`
      }
    ]
    const clickIcon = () => {
      router.push('home')
    }
    const iconInstance = ref()

    const icon = () => {
      return (
        <div
          ref='iconInstance'
          onClick={clickIcon}
          class={
            'absolute w-[5vh] h-[5vh] hover:h-[6vh] hover:w-[6vh] transition-all ease-in-out duration-500 hover:translate-x-[20%] '
          }
        />
      )
    }
    const iconContainer = () => {
      return (
        <div class='flex-1 h-[100%] flex items-center pl-[2%] text-white'>
          <div class={'relative w-[20%] h-[60%]  flex items-center'}>
            {icon()}
          </div>
        </div>
      )
    }

    const navButtonList = () => {
      return (
        <div class='w-[40%] h-[100%] flex items-center justify-around '>
          <ButtonList class={['w-[70%] h-[100%]']} tagList={tagList[0]} />
        </div>
      )
    }

    const rightButton = () => {
      return (
        <div class='w-[30%] h-[100%] flex items-center justify-center  '>
          <ButtonList class={[' w-[70%] h-[100%]']} tagList={tagList[1]} />
        </div>
      )
    }

    const context = () => {
      return (
        <div class='flex items-center justify-between'>
          {[iconContainer(), navButtonList(), rightButton()]}
        </div>
      )
    }
    onMounted(() => {
      iconInstance.value.style.background = 'rgb(255,255,255)'
      iconInstance.value.style.background =
        'radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 65%)'
    })

    return {
      context,
      iconInstance
    }
  },
  render() {
    return this.context()
  }
})
