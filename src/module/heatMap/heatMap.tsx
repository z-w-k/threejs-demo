import { MainStore } from "../../store/mainStore"

export default defineComponent({
    setup(){
        const mainStore =  MainStore()
        onMounted(()=>{
            console.log(mainStore.utilSet.threeScene);
            
        })
        return {}
    },
    render(){
        return(
            <div>
                Demo1
            </div>
        )
    }
})