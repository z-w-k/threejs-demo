import * as THREE from 'three'
import { MainStore, ScenePosition } from '../../store/mainStore'
import ParticleSystem from '../../util/shader/system'
import FlameEmitter from '../../util/shader/flame'

export default defineComponent({
  props: {},
  setup(props, { emit }) {
    const mainStore = MainStore()
    const route = useRoute()
    let psMeshGroup: THREE.Group

    // const psPosition = [
    //   [
    //     [
    //       { position: [-97.5, 2, -3], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -6], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -9], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -12], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -15], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -18], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -21], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -24], rotate: psRotate.left, name: 'left' },
    //       { position: [-97.5, 2, -27], rotate: psRotate.left, name: 'left' }
    //     ],
    //     [
    //       { position: [-89.5, 2, -3], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -6], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -9], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -12], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -15], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -18], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -21], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -24], rotate: psRotate.right, name: 'right' },
    //       { position: [-89.5, 2, -27], rotate: psRotate.right, name: 'right' }
    //     ]
    //   ],
    //   [
    //     [
    //       { position: [-82, 2, -3], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -6], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -9], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -12], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -15], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -18], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -21], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -24], rotate: psRotate.left, name: 'left' },
    //       { position: [-82, 2, -27], rotate: psRotate.left, name: 'left' }
    //     ],
    //     [
    //       { position: [-74, 2, -3], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -6], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -9], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -12], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -15], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -18], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -21], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -24], rotate: psRotate.right, name: 'right' },
    //       { position: [-74, 2, -27], rotate: psRotate.right, name: 'right' }
    //     ]
    //   ]
    // ]
    const group = new THREE.Group()

    const initFlame = (targetPosition: THREE.Vector3) => {
      const position = [targetPosition.x, targetPosition.y, targetPosition.z]
      group.name = '粒子'
      const emitter = new ParticleSystem(
        new FlameEmitter({
          position: position,
          rotate: [7, 0, 0]
        })
      )
      group.add(emitter.mesh)
      mainStore.utilSet.threeScene!.scene.add(group)
      return emitter
    }

    const play =(emitter:ParticleSystem)=>{
      emitter.start()
    console.log(mainStore.utilSet.threeScene?.scene);

    }


    let emitter:ParticleSystem
    const init = () => {
      const targetPosition = mainStore.flyTo(
        route.name as keyof ScenePosition
      ).controlsTarget
      
      emitter=initFlame(targetPosition)
      play(emitter)

    }
    onMounted(() => {
      init()
    })

    onBeforeUnmount(()=>{
      setTimeout(() => {
        emitter.stop()
        emitter.destroy()
        mainStore.utilSet.threeScene?.clearScene(group)
      }, 1000);
    })

    return {}
  },
  render() {
    return <div></div>
  }
})
