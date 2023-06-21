import MenuButton, { TagList } from '../../utils/menuButton'
export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const tagListSet: TagList[] = [
      {
        textList: [
          { text: '开始', pathName: 'playing' },
          // { text: '帮助', pathName: 'help' },
          { text: '设置', pathName: 'setting' },
          { text: '调试模式', pathName: 'debugModel' },
          {
            text: 'GitHub',
            pathName: 'https://github.com/1099571219/threejs-demo'
          }
        ],
        class: 'w-[100%] h-[20%] !text-2xl font-black'
      }
    ]

    return {
      tagListSet
    }
  },
  render() {
    return (
      <div class={['menu_container']}>
        <div
          class={[
            ' cursor-default absolute top-[20%] left-[50%] translate-x-[-50%] text-5xl font-black'
          ]}>
          THREE DEMO
        </div>
        <MenuButton
          class={[
            'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[0] flex-col h-[40%] w-[15%]'
          ]}
          tagList={this.tagListSet[0]}
        />
        <div class={['absolute bottom-5 left-[50%] translate-x-[-50%]']}>
          <a href='https://beian.miit.gov.cn' target='_blank'>
            京ICP备2023014619号
          </a>
        </div>
      </div>
    )
  }
})
