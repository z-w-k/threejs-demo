export default defineComponent({
    setup(){
        const a = ref(0)
        const st = ref('' as string)
        st.value = '123'
        return {a}
    },
    render(){
        return(
            <div>
                Demo1
            </div>
        )
    }
})