import { MainStore } from './../../store/mainStore';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CameraConfig } from '../ThreeScene'
import * as THREE from 'three'
import { API } from '../../api/api'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Octree } from 'three/examples/jsm/math/Octree'
import { pinia } from '../../main'

let mainStore:ReturnType<typeof MainStore>
export class ThreeBase {
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  controls!: OrbitControls
  light!: THREE.Light
  stats= new Stats()
  gui= new GUI({ width: 200 })
  worldOctree = new Octree()
  three = THREE
  loadingManager = new THREE.LoadingManager()
  axesHelper = new THREE.AxesHelper(5)
  constructor(
    public domElement: HTMLElement,
    public cameraConfig: CameraConfig
  ) {
    mainStore = MainStore()
    this.initBase()

  }
  initBase = () => {
    this.scene = this.initScene()
    this.camera = this.initCamera()
    this.renderer = this.initRenderer()
    this.controls = this.initControls()
    this.light = this.initLight()
    this.camera.rotation.order = 'YXZ'
    this.scene.background = new THREE.Color(0x88ccee)
    this.scene.fog = new THREE.Fog(new THREE.Color('rgb(100,100,150)'), 0, 1000)
    this.scene.add(this.camera)
    this.scene.add(this.light)
    this.initStats()
    this.loadModel()
    this.initAxes()
  }
  initAxes = () => {
    this.axesHelper.visible = false
    const axesFolder = this.gui.addFolder('Axes')
    axesFolder.add(this.axesHelper,'visible').name('visible')
    axesFolder.add(this.axesHelper.position,'y',-15,15,0.1).name('y')
    axesFolder.open()
    this.scene.add(this.axesHelper)
  }
  initStats() {
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = '0px'
    this.domElement.appendChild(this.stats.dom)
  }
  initScene = () => {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color('black')
    return scene
  }
  initCamera = () => {
    const cameraConfig = this.cameraConfig
    const domElement = this.domElement
    new THREE.PerspectiveCamera()
    const camera = new THREE.PerspectiveCamera(
      cameraConfig.fov,
      domElement.clientWidth / domElement.clientHeight,
      cameraConfig.near,
      cameraConfig.far
    )
    return camera
  }
  initRenderer = () => {
    const domElement = this.domElement
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: 'highp',
      logarithmicDepthBuffer: true
    })
    renderer.setSize(domElement.clientWidth, domElement.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    domElement.appendChild(renderer.domElement)
    return renderer
  }
  initControls = () => {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true // 手动操作更顺滑
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableRotate = true
    // controls.minDistance = 40
    // controls.maxDistance = 80
    return controls
  }
  initLight = () => {
    // 环境光
    const AmbientLight = new THREE.AmbientLight('#fff', 0.2)
    return AmbientLight
  }
  clearScene = (scene: THREE.Object3D) => {
    scene.traverse((child: THREE.Object3D) => {
      if ((<THREE.Mesh>child).material) {
        ;(<any>child).material._listeners.dispose[0]()
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
  loadModel = async () => {
    const modelUrl = await API.getModel(mainStore.onDownloadProgress)
    modelUrl.data.forEach((url: string) => {
      new GLTFLoader(this.loadingManager).load(url, (gltf) => {
        this.scene.add(gltf.scene)
        this.scene.traverse((obj) => {
          if (obj.type === 'Mesh') {
            obj.layers.enable(0)
            obj.receiveShadow = true
            obj.castShadow = true
            if (obj.name === 'ground') {
              console.log(obj)
              obj.castShadow = false
              this.worldOctree.fromGraphNode(obj)
            }
            if (obj.name === 'water') {
              obj.receiveShadow = false
            }
          }
        })
        this.loadingManager.onLoad = () => {
          console.log('模型加载完毕')
          
          console.log(this.scene)
        }
      })
    })
    return
  }
}
