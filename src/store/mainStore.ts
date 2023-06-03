import ThreeScene from '../util/ThreeScene'
import HomePoints from '../util/homePoints'
import TweenJS from '../util/tween'
import {
  Layers,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3
} from 'three'
import TemperatureField from '../util/temperature'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

interface UtilSet {
  threeScene?: ThreeScene
  homePoints?: HomePoints
  tweenJS?: TweenJS
  temp?: TemperatureField
}

export interface flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: {
    camera: number
    controls: number
  }
}

class FlyToPosition implements flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: flyToPosition['needTime'] = { camera: 0, controls: 0 }
  constructor(
    controlsTarget: number[],
    positionTarget: number[],
    needTime: number[]
  ) {
    this.controlsTarget = new Vector3(...controlsTarget)
    this.positionTarget = new Vector3(...positionTarget)
    this.needTime.camera = needTime[0]
    this.needTime.controls = needTime[1]
  }
}

export interface ScenePosition {
  enterPosition: FlyToPosition
  heatMap: FlyToPosition
  // homePosition:FlyToPosition,
}

export const MainStore = defineStore('mainStore', () => {
  let threeScene!: ThreeScene
  let homePoints!: HomePoints
  let tweenJS!: TweenJS
  let temp!: TemperatureField
  const container = ref()
  const enter = ref(false)
  const utilSet: Ref<UtilSet> = ref({})
  const scenePosition: Ref<ScenePosition> = ref({
    heatMap: new FlyToPosition([0, -2200, 0], [0, -2000, 20], [1, 1]),
    // homePosition: new FlyToPosition([1, 0, 0], [-2000, -2000, -2000], [2, 2]),
    enterPosition: new FlyToPosition([0, 0, 0], [0, -130, 0], [1, 1]),
    points: new FlyToPosition([0, -1000, 0], [0, -1000, 20], [1, 1])
  })

  const init = (homeContainer: HTMLElement) => {
    container.value = homeContainer
    threeScene = new ThreeScene(homeContainer)
    homePoints = new HomePoints(homeContainer, threeScene)
    tweenJS = new TweenJS(threeScene)
    temp = new TemperatureField(threeScene)
    utilSet.value.threeScene = threeScene
    utilSet.value.homePoints = homePoints
    utilSet.value.tweenJS = tweenJS
    utilSet.value.temp = temp
    // const box = new THREE.Mesh(new THREE.BoxGeometry(1000,1000,1000),new THREE.MeshBasicMaterial({color:'white'}))
    // threeScene.scene.add(box)
    threeScene.camera.position.set(0, -150, 0)
    threeScene.controls.target.set(0, 0, 0)
    threeScene.controls.update()
    window.addEventListener('resize', threeScene.onWindowResize)


    bloomLayer.set(BLOOM_SCENE)

    const params = {
      threshold: 0,
      strength: 3,
      radius: 0.5,
      exposure: 1
    }

    const renderScene = new RenderPass(threeScene.scene, threeScene.camera)

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    bloomComposer = new EffectComposer(threeScene.renderer)
    bloomComposer.renderToScreen = false
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)

    const mixPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: `
          varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
      `,
        fragmentShader: `
        uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}
      `,
        defines: {}
      }),
      'baseTexture'
    )
    mixPass.needsSwap = true

    finalComposer = new EffectComposer(threeScene.renderer)
    finalComposer.addPass(renderScene)
    finalComposer.addPass(mixPass)
  }

  const flyTo = (positionName: keyof ScenePosition) => {
    const position = scenePosition.value[positionName]
    tweenJS.flyTo(position)
    return position as FlyToPosition
  }

  const btIsEnter = (isEnter: boolean) => {
    enter.value = isEnter
    const target = isEnter ? 'enterPosition' : 'homePosition'
    flyTo(target as keyof ScenePosition)
  }

  const bloomLayer = new Layers()
  const BLOOM_SCENE = 1
  const materials = {} as any
  const darkMaterial = new MeshBasicMaterial({ color: 'black' })
  let bloomComposer: any
  let finalComposer: any

  function disposeMaterial(obj: any) {
    if (obj.material) {
      obj.material.dispose()
    }
  }

  function darkenNonBloomed(obj: any) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      materials[obj.uuid] = obj.material
      obj.material = darkMaterial
    }
  }

  function restoreMaterial(obj: any) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid]
      delete materials[obj.uuid]
    }
  }

  let animateId
  const animate = () => {
    tweenJS.tween.update()
    homePoints.update()
    threeScene.animate()
    // threeScene.scene.traverse(darkenNonBloomed) // 隐藏不需要辉光的物体
    // bloomComposer.render()
    // threeScene.scene.traverse(restoreMaterial) // 还原
    // finalComposer.render()
    animateId = requestAnimationFrame(animate)
  }

  return { utilSet, enter, init, animate, btIsEnter, flyTo }
})

export const HomeStore = defineStore('homeStore', () => {})
