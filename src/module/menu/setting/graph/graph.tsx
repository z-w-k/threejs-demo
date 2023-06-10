import { Col, InputNumber, Slider } from 'ant-design-vue'
import { MainStore } from '../../../../store/mainStore'
import { AmbientLight, Light } from 'three'
export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const inputValue = ref<number>(0)
    const mainStore = MainStore()
    onMounted(() => {})
    const options = ref([
      {
        name: '亮度',
        key: 'intensity',
        value: (mainStore.utilSet.threeScene?.light as any) || { intensity: 0 }
      }
    ])
    return {
      options
    }
  },
  render() {
    return (
      <div>
        {this.options.map((item) => (
          <div class={['flex items-center justify-around']}>
            <div class={['w-[20%] px-[5%] text-2xl']}>亮度</div>
            <Col class={['flex-1 px-[5%]']}>
              <Slider
                v-model:value={item.value[item.key as string]}
                min={0}
                max={1}
                step={0.01}
              />
            </Col>
            <Col>
              <InputNumber
                v-model:value={item.value[item.key as keyof string]}
                min={0}
                max={1}
                step={0.01}
              />
            </Col>
          </div>
        ))}
      </div>
    )
  }
})
