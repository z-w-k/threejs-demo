import Header from './header/header'
import Footer from './footer/footer'
import { MainStore } from '../../store/mainStore'
export default defineComponent({
  setup(props, { emit }) {
    const header = () => {
      return (
        <Header class='w-[100%] h-[10%]   absolute top-0 left-[50%] translate-x-[-50%]' />
      )
    }
    const footer = (
      <Footer class='pointer-events-none none w-[100%] h-[10%]  absolute bottom-0 left-0' />
    )
    const layout = [header, footer]
    return {
      layout
    }
  },
  render() {
    return this.layout.map((item) => {
      if (item instanceof Function) {
        return item()
      } else {
        return item
      }
    })
  }
})
