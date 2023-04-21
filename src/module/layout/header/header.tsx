import { Vector3 } from 'three';
import ButtonList from '../../utils/button'
import { MainStore } from '../../../store/mainStore';

export default defineComponent({
  setup(props, { emit }) {
    const mainStore = MainStore()
   
    const clickIcon = () => {
      mainStore.utilSet.tweenJS?.flyTo('homePosition')
      mainStore.btIsEnter(false)
    }
    const test1 = ref(false)
    const iconInstance = ref()

    const icon = () => {
      return (
        <div
          ref='iconInstance'
          onClick={clickIcon}
          class={
            'border-2 absolute w-[5vh] h-[5vh] hover:h-[6vh] hover:w-[6vh] transition-all ease-in-out duration-500 hover:translate-x-[100%] '
          }></div>
      )
    }
    const iconContainer = () => {
      return (
        <div class='flex-1 h-[100%] border-[1px] border-blue-500 flex items-center pl-[2%] text-white'>
          {test1.value + ''}
          <div class={'relative w-[20%] h-[60%] border-2 flex items-center'}>
            {icon()}
          </div>
          {/* <div class={'absolute  text-black hover:text-white'}></div> */}
        </div>
      )
    }

    const navButtonList = () => {
      return (
        <div class='w-[40%] h-[100%] flex items-center justify-around border-[1px] border-red-500'>
          <ButtonList
            class={['w-[70%] h-[100%]']}
            tagList={mainStore.tagList[0]}
          />
        </div>
      )
    }

    const rightButton = () => {
      return (
        <div class='w-[30%] h-[100%] flex items-center justify-center  border-[1px] border-red-500'>
          <ButtonList
            class={[' w-[70%] h-[100%]']}
            tagList={mainStore.tagList[1]}
          />
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
