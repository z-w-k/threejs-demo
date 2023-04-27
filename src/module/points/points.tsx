import * as THREE from 'three'
import { MainStore, ScenePosition } from '../../store/mainStore'
import ParticleSystem from '../../util/shader/system'

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

    const init = () => {
      psMeshGroup = new THREE.Group()
      const group = psMeshGroup
      group.name = '粒子'
      // psPosition.forEach((stove, stoveInd) => {
      //   stove.forEach((side, sideIndex) => {
      //     side.forEach((psInfo) => {
      //       const emitter = new ParticleSystem({
      //         // emitter: new FlameEmitter({
      //         //   position: psInfo.position,
      //         //   rotate: psInfo.rotate,
      //         // }),
      //       });
      //       emitter.name = psInfo.name;
      //       // group.add(emitter.mesh);
      //       psInfo.ps = emitter;
      //     });
      //   });
      // });
      mainStore.utilSet.threeScene!.scene.add(group)
    }
    onMounted(() => {
      init()
      mainStore.flyTo(route.name as keyof ScenePosition)
    })
    return {}
  },
  render() {
    return <div>points</div>
  }
})
