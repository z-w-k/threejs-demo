import { MainStore } from "../../store/mainStore"

export default defineComponent({
setup(props,ctx){
    const mainStore = MainStore()
    onMounted(()=>{
        mainStore.flyTo('enterPosition')
    })
return{}
},
render() {
return <div></div>

},
})