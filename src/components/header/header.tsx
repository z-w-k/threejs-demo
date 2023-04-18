import ButtonList from '../utils/button'
type tagList = Array<string[]>

export default defineComponent({
  props: {
    onHomeIndex: Function,
    isHomeIndex: ref<Boolean>
  },
  setup(props, { emit }) {
    let tagList: tagList = [
      ['01  Intro', 'ThreeOS Z', 'Integrations', 'TZ ID'],
      ['Launch ThreeOS Z', 'Hub']
    ]

    const clickIcon = () => {
      emit('homeIndex', !props.isHomeIndex!.value)
    }

    const headerButton: JSX.Element[][] = [[], []]
    // const buttonList = tagList.map((list, listIndex) => {
    //   return (
    //     <div
    //       class={[
    //         'flex items-center',
    //         listIndex === 0 ? 'h-[30%] border-[1px]' : 'h-[60%] border-[2px]'
    //       ]}>
    //       {list.map((text) => {
    //         return <div class={[listIndex === 0 ? '' : '']}>{text}</div>
    //       })}
    //     </div>
    //   )
    // })
    // console.log(buttonList)

    const icon = (
      <div class='flex-1 relative h-[100%] border-[1px] border-blue-500 '>
        <i-uil-circle
          onClick={clickIcon}
          class=' absolute left-[10%] top-[50%] translate-y-[-50%] border-[1px] border-red-500 h-[50%] w-[auto]'
        />
      </div>
    )

    const navButtonList = (
      <div class='w-[40%] h-[100%] flex items-center justify-around border-[1px] border-red-500'>
        <ButtonList class={['w-[70%] h-[30%]']} buttonClass={''} tagList={tagList[0]} />
      </div>
    )

    const rightButton = (
      <div class='w-[30%] h-[100%] flex items-center justify-center  border-[1px] border-red-500'>
        <ButtonList class={['h-[60%] w-[60%]']} buttonClass={''} tagList={tagList[1]} />
      </div>
    )

    return () => (
      <div class='flex items-center justify-between'>
        {[icon, navButtonList,rightButton]}
      </div>
    )
  }
  // render() {
  //   return (
  //     this.container
  //   )
  // },
})
