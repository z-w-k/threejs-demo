import Header from './header/header'
import Footer from './footer/footer'
export default defineComponent({
  setup(props, { emit }) {},
  render() {
    return (
      <>
        <Header class='w-[100%] h-[10%] absolute top-0 left-[50%] translate-x-[-50%]' />
        <Footer class='pointer-events-none none w-[100%] h-[10%] absolute bottom-0 left-0' />
      </>
    )
  }
})
