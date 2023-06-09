import MenuButton from '../utils/menuButton'

export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const tagListSet = [
      {
        textList: [
          { text: '开始', path: '' },
          { text: '帮助', path: '' },
          { text: '设置', path: '' },
        ],
        class:
          '!w-[23%] !h-[20%] hover:!bg-[#fff] hover:!text-black hover:!h-[25%]'
      }
    ]
    return {
        tagListSet
    }
  },
  render() {
    return <MenuButton class={['flex-col']} tagList={this.tagListSet[0]} />
  }
})
