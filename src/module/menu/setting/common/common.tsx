export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const options = [
        {
            name:'时间',
            value:true
        }
    ]
    return {}
  },
  render() {
    return <div>
        <div class={['flex-1']}>1</div>
        <div class={['flex-1']}>2</div>
        <div class={['flex-1']}>3</div>
    </div>
  }
})
