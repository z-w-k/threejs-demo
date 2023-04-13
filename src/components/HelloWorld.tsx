export default defineComponent({
  setup(){
    const a = 123
    return {
      a
    }
  },
  render(){
    return (
      <div>
      <Demo2 />
      <AButton>{this.a}</AButton>
      <i-material-symbols-2k />
      </div>
      
    )
  }
})
