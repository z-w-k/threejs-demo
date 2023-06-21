import { MainStore } from '../../store/mainStore'
import './loading.scss'

export default defineComponent({
  props: {},
  setup(props, { emit }) {},
  render() {
    const mainStore = MainStore()

    return (
      <div
        class={[
          'relative h-[100%] w-[100%] bg-black flex justify-center items-center'
        ]}>
        <div
          class={
            'absolute left-50% translate-x-[0%] bottom-[35%] text-lg font-black'
          }>
          {`${mainStore.loadingProgress.name}: ${mainStore.loadingProgress.progress}`}{' '}
          %
        </div>
        <div
          class={['demo-cube perspective pink']}
          style={`--per: ${mainStore.loadingProgress.progress}%`}>
          <ul class={['cube']}>
            <li class='top'></li>
            <li class='bottom'></li>
            <li class='front'></li>
            <li class='back'></li>
          </ul>
        </div>
      </div>
    )
  }
})
