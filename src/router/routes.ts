import HelloWorld from "../components/home/home";
const childRoute =  import.meta.glob('../components/**/*.router.ts')

const a =Object.keys(childRoute).filter(url=>{
    return url
})

const routes = [
    {
        path:'/',
        component:HelloWorld,
        children:[]
    }
]

export default routes