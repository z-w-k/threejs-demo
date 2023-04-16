import HomeIndex from "../components/home/homeIndex";
const childRoute =  import.meta.glob('../components/**/*.router.ts')

const a =Object.keys(childRoute).filter(url=>{
    return url
})

const routes = [
    {
        path:'/',
        component:HomeIndex,
        children:[]
    }
]

export default routes