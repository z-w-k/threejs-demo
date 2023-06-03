import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js' // 着色器通道
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js' // 抗锯齿着色器
import * as THREE from 'three'
interface cameraConfig {
  fov: number
  near: number
  far: number
}
class ThreeScene {
  domElement: HTMLElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  light: THREE.Light
  loadingManager: THREE.LoadingManager
  windowHalfX: number = 0
  windowHalfY: number = 0
  three
  params = {
    // 跟辉光光晕有关的变量
    exposure: 0.5,
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: 1,
    scene: 'Scene with Glow'
  }
  materials: {
    [arg: string]:
      | THREE.Material
      | THREE.Material[]
      | THREE.Texture
      | THREE.Color
      | THREE.CubeTexture
      | null
  } = {} // 跟辉光光晕有关的变量
  bloomIgnore = new Array() // 跟辉光光晕有关的变量
  bloomLayer = new THREE.Layers() // 跟辉光光晕有关的变量
  darkMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.Texture(),
    transparent: true
  }) // 跟辉光光晕有关的变量
  ENTIRE_SCENE = 0
  BLOOM_SCENE = 1 // 跟辉光光晕有关的变量
  bloomComposer: EffectComposer
  finalComposer: EffectComposer
  constructor(
    domElement: HTMLElement,
    cameraConfig: cameraConfig = { fov: 60, near: 0.1, far: 500 }
  ) {
    this.bloomLayer.set(this.BLOOM_SCENE)

    this.domElement = domElement
    this.scene = this.initScene()
    this.camera = this.initCamera(cameraConfig)
    this.renderer = this.initRenderer()
    this.bloomComposer = new EffectComposer(this.renderer) // EffectComposer可以理解为着色器通道容器，着色器通道按照先后顺序添加进来并执行
    this.finalComposer = new EffectComposer(this.renderer)
    this.bloom()
    this.controls = this.initControls()
    this.light = this.initLight()
    this.loadingManager = new THREE.LoadingManager()

    this.three = THREE
  }
  initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    return scene
  }
  initCamera(cameraConfig: cameraConfig) {
    new THREE.PerspectiveCamera()
    const camera = new THREE.PerspectiveCamera(
      cameraConfig.fov,
      this.domElement.clientWidth / this.domElement.clientHeight,
      cameraConfig.near,
      cameraConfig.far
    )
    this.scene.add(camera)
    return camera
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: 'highp',
      logarithmicDepthBuffer: true
    })
    renderer.setSize(this.domElement.clientWidth, this.domElement.clientHeight)
    this.domElement.appendChild(renderer.domElement)
    return renderer
  }
  initControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true // 手动操作更顺滑
    controls.update()
    controls.enabled = true
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableRotate = true
    // controls.minDistance = 40
    // controls.maxDistance = 80
    return controls
  }
  initLight() {
    // 环境光
    const AmbientLight = new THREE.AmbientLight('#fff', 3)
    this.scene.add(AmbientLight)
    return AmbientLight
  }
  loadModel() {
    return new GLTFLoader(this.loadingManager)
  }
  onWindowResize = () => {
    this.windowHalfX = this.domElement.clientWidth / 2
    this.windowHalfY = this.domElement.clientHeight / 2
    this.camera.aspect =
      this.domElement.clientWidth / this.domElement.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(
      this.domElement.clientWidth,
      this.domElement.clientHeight
    )
  }
  bloom = () => {
    let container = this.domElement //显示3D模型的容器
    // 去掉锯齿---1
    // 通过ShaderPass构造函数把FXAAShader着色器和uniforms构成的对象作为参数，创建一个锯齿通道FXAAShaderPass,然后把锯齿通道插入到composer中。
    const effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms['resolution'].value.set(
      0.6 / window.innerWidth,
      0.6 / window.innerHeight
    ) // 渲染区域Canvas画布宽高度  不一定是全屏，也可以是区域值
    effectFXAA.renderToScreen = true
    // 去掉锯齿---1
    const renderScene = new RenderPass(this.scene, this.camera) // RenderPass这个通道会在当前场景（scene）和摄像机（camera）的基础上渲染出一个新场景，新建：
    // 添加光晕效果---2
    let bloomPass = new UnrealBloomPass( // UnrealBloomPass通道可实现一个泛光效果。
      new THREE.Vector2(
        this.domElement.clientWidth,
        this.domElement.clientHeight
      ),
      2,
      1,
      1
    )
    bloomPass.threshold = this.params.bloomThreshold
    bloomPass.strength = this.params.bloomStrength
    bloomPass.radius = this.params.bloomRadius
    // 添加光晕效果---2
    // 着色器通道容器--放进容器里
    this.bloomComposer.renderToScreen = false
    this.bloomComposer.addPass(renderScene)
    this.bloomComposer.addPass(bloomPass) // 添加光晕效果
    this.bloomComposer.addPass(effectFXAA) // 去掉锯齿
    // 着色器通道容器--放进容器里
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
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
    finalPass.needsSwap = true
    this.finalComposer.addPass(renderScene)
    this.finalComposer.addPass(finalPass)
    this.finalComposer.addPass(effectFXAA)
  }
  darkenNonBloomed = (obj: THREE.Object3D<THREE.Event>) => {
    if (obj instanceof THREE.Scene) {
      // 此处忽略Scene，否则场景背景会被影响
      obj.background = null
      this.materials.scene = obj.background
    }
    if (
      obj instanceof THREE.Sprite || // 此处忽略Sprite
      this.bloomIgnore.includes(obj.type) ||
      ((<THREE.Mesh>obj).isMesh && this.bloomLayer.test(obj.layers) === false) // 判断与辉光是否同层
    ) {
      this.materials[obj.uuid] = (<THREE.Mesh>obj).material
      ;(<THREE.Mesh>obj).material = this.darkMaterial
    }
  }

  restoreMaterial: (obj: THREE.Object3D<THREE.Event>) => any = (obj) => {
    if (obj instanceof THREE.Scene) {
      // obj.background = this.materials.scene;
      obj.background = null
      delete this.materials.scene
    }
    if (this.materials[obj.uuid]) {
      ;(<THREE.Mesh>obj).material = this.materials[obj.uuid] as
        | THREE.Material
        | THREE.Material[]
      delete this.materials[obj.uuid]
    }
  }
  animate = () => {
    this.controls.update()
    this.scene.traverse(this.darkenNonBloomed) // 隐藏不需要辉光的物体
    this.bloomComposer.render()
    this.scene.traverse(this.restoreMaterial) // 还原
    this.finalComposer.render()
    // this.renderer.render(this.scene, this.camera)
    
  }
  clearScene = (scene:THREE.Object3D) => {
    scene.traverse((child: THREE.Object3D) => {
      if ((<THREE.Mesh>child).material) {
        // child.material.dispose && child.material.dispose()
      }
      if ((<THREE.Mesh>child).geometry) {
        ;(<THREE.Mesh>child).geometry.dispose()
      }
    })

    // 场景中的参数释放清理或者置空等
    // this.scene.clear()
    // this.renderer.forceContextLoss()
    // this.renderer.dispose()
    // this.domElement.innerHTML = ''
    console.log('clearScene')
  }
}

export default ThreeScene
