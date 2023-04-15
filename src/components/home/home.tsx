import { Button } from 'ant-design-vue'
import Demo1 from '../demo1/Demo1'
// import Demo2 from "../Demo2"

export default defineComponent({
  setup() {
    const homeContainer = ref<HTMLElement | null | string>('123')
    onMounted(() => {
      console.log('挂载了')
    })
    console.log('setup')
    return {
      homeContainer,
    }
  },
  render() {
    return <div ref={(tag) => {}}>这是官网</div>
  },
})
