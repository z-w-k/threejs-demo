import { MainStore, OnDownloadProgress } from './../../store/mainStore'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CameraConfig } from '../ThreeScene'
import * as THREE from 'three'
import { API } from '../../api/api'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Octree } from 'three/examples/jsm/math/Octree'
import { pinia } from '../../main'
import { reject } from 'lodash'

let mainStore: ReturnType<typeof MainStore>
export class ThreeBase {
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  controls!: OrbitControls
  AmbLight!: THREE.AmbientLight
  dirLight!: THREE.DirectionalLight
  hemiLight!: THREE.HemisphereLight
  moveLight!: THREE.PointLight
  stats = new Stats()
  gui = new GUI({ width: 200 })
  commonGUI!: GUI
  worldOctree = new Octree()
  three = THREE
  axesHelper = new THREE.AxesHelper(5)
  constructor(
    public domElement: HTMLElement,
    public cameraConfig: CameraConfig
  ) {
    mainStore = MainStore()
    this.initBase()
  }
  initBase = () => {
    this.commonGUI = this.gui.addFolder('common')
    this.scene = this.initScene()
    this.camera = this.initCamera()
    this.renderer = this.initRenderer()
    this.controls = this.initControls()
    this.initLight()
    // this.moveLight.position.setZ(-3)
    this.camera.rotation.order = 'YXZ'
    this.scene.background = null
    this.scene.fog = new THREE.Fog(
      new THREE.Color('rgb(100,100,150)'),
      0,
      10000
    )
    this.commonGUI.add(this.scene.fog, 'near', 0, 1000, 1).name('Fog_near')
    this.commonGUI.add(this.scene.fog, 'far', 0, 10000, 1).name('Fog_far')
    this.scene.add(this.camera)
    this.initStats()
    this.initAxes()
  }

  initLight = () => {
    this.hemiLight = this.initHemiLight()
    this.AmbLight = this.initAmb()
    this.dirLight = this.initDir()
    const dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight)
    this.commonGUI.openAnimated(true)
    this.commonGUI.add(dirLightHelper, 'visible').name('dirLightHelper')

    const lightGroup = new THREE.Group()
    lightGroup.add(this.hemiLight)
    lightGroup.add(this.AmbLight)
    lightGroup.add(this.dirLight)
    lightGroup.add(dirLightHelper)
    lightGroup.name = 'lightGroup'

    this.scene.add(lightGroup)
  }

  initHemiLight = () => {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 50, 0)
    return hemiLight
  }
  testBox = () => {
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const mate = new THREE.MeshBasicMaterial({ color: 'blue' })
    return new THREE.Mesh(geo, mate)
  }
  initAxes = () => {
    this.axesHelper.visible = false
    const axesFolder = this.gui.addFolder('Axes')
    axesFolder.add(this.axesHelper, 'visible').name('visible')
    axesFolder.add(this.axesHelper.position, 'y', -15, 15, 0.1).name('y')
    axesFolder.open()
    this.scene.add(this.axesHelper)
  }
  initStats() {
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = '50px'
    this.stats.dom.hidden = true
    this.commonGUI.add(this.stats.dom, 'hidden').name('hideStats')
    this.commonGUI.open()
    this.domElement.appendChild(this.stats.dom)
  }
  initScene = () => {
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000511)
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
    this.commonGUI
      .add(renderer, 'toneMappingExposure', 0, 10, 0.1)
      .name('rendererToneMappingExposure')
    renderer.shadowMap.enabled = true
    renderer.domElement.className = 'threeScene'
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
  initMoveLight = () => {
    const pointLight = new THREE.PointLight(0xffffff, 10, 3, 3)
    pointLight.castShadow = true
    return pointLight
  }

  initDir() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 6.4)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 4096 // default
    directionalLight.shadow.mapSize.height = 4096 // default

    // 设置三维场景计算阴影的范围
    directionalLight.shadow.camera.left = -200
    directionalLight.shadow.camera.right = 200
    directionalLight.shadow.camera.top = 200
    directionalLight.shadow.camera.bottom = -200
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.radius = 0.5
    directionalLight.shadow.bias = -0.00005
    directionalLight.position.setY(10)

    const dirLightFolder = this.commonGUI.addFolder('dirLight')
    dirLightFolder
      .add(directionalLight, 'intensity', 0, 10, 0.1)
      .name('Directional_Light')
    dirLightFolder
      .add(directionalLight.position, 'x', -100, 100, 1)
      .name('dirX')
    dirLightFolder
      .add(directionalLight.position, 'y', -100, 100, 1)
      .name('dirY')
    dirLightFolder
      .add(directionalLight.position, 'z', -100, 100, 1)
      .name('dirZ')
    dirLightFolder
      .add(directionalLight.target.position, 'x', -100, 100, 1)
      .name('dirTarX')
    dirLightFolder
      .add(directionalLight.target.position, 'y', -100, 100, 1)
      .name('dirTarY')
    dirLightFolder
      .add(directionalLight.target.position, 'z', -100, 100, 1)
      .name('dirTarZ')
    return directionalLight
  }
  initAmb = () => {
    // 环境光
    const AmbientLight = new THREE.AmbientLight('#fff', 0.2)
    this.commonGUI
      .add(AmbientLight, 'intensity', 0, 3, 0.1)
      .name('Ambient_Light')
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

  loadModel = (modelUrl: string, GLTFLoaderIns: GLTFLoader) => {
    GLTFLoaderIns.load(modelUrl, (gltf) => {
      gltf.scene.traverse((obj: THREE.Object3D | THREE.Mesh) => {
        if (obj.type === 'Mesh') {
          obj.layers.enable(0)
          obj.castShadow = true
          obj.receiveShadow = true
          ;(<any>obj).material.shadowSide = THREE.BackSide
          ;(<any>obj).material.side = 0
          if (obj.name === 'ground') {
            this.worldOctree.fromGraphNode(obj)
            obj.castShadow = false
          }
          if (obj.name === 'water') {
            obj.receiveShadow = false
          }
        }
      })
      this.scene.add(gltf.scene)
    })
  }
}
