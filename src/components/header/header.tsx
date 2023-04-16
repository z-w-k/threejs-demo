import { Button } from 'ant-design-vue'
type tagList = Array<string[]>

export default defineComponent({
  setup(props, ctx) {
    let tagList: tagList = [
      ['01  Intro', 'ThreeOS Z', 'Integrations', 'TZ ID'],
      ['Launch ThreeOS Z', 'Hub'],
    ]

    const headerButton: JSX.Element[][] = [[], []]
    const header = tagList.map((list, listIndex) => {
      return (
        <div
          class={[
            'flex items-center',
            listIndex === 0 ? 'h-[30%] border-[1px]' : 'h-[60%] border-[2px]',
          ]}>
          {list.map((text) => {
            return <div class={[listIndex === 0 ? '' : '']}>{text}</div>
          })}
        </div>
      )
    })
    console.log(header)

    return {
      headerButton,
      header,
    }
  },
  render() {
    return (
      <div class='flex items-center justify-between'>
        <div class='flex-1 relative h-[100%] border-[1px] border-blue-500 '>
          <i-uil-circle class=' absolute left-[10%] top-[50%] translate-y-[-50%] border-[1px] border-red-500 h-[50%] w-[auto]' />
        </div>
        <div class='w-[70%] h-[100%] flex items-center justify-around border-[1px] border-red-500'>
          {this.header}
        </div>
      </div>
    )
  },
})
