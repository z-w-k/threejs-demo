import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CameraConfig } from '../ThreeScene'
import * as THREE from 'three'
import { API } from '../../api/api'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ThreeBaseApi } from './baseAPI'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Octree } from 'three/examples/jsm/math/Octree'
export class ThreeBase extends ThreeBaseApi {
  three = THREE
  loadingManager = new THREE.LoadingManager()
  constructor(public dom: HTMLElement, public camConfig: CameraConfig) {
    super()
    this.stats = new Stats()
    this.gui = new GUI({ width: 200 })
    this.worldOctree = new Octree()
    this.initBase()
    this.initStats()
    this.loadModel()
  }
  initBase = () => {
    this.scene = this.initScene()
    this.camera = this.initCamera()
    this.renderer = this.initRenderer()
    this.controls = this.initControls()
    this.light = this.initLight()
    this.camera.rotation.order = 'YXZ'
    this.scene.background = new THREE.Color(0x88ccee)
    this.scene.fog = new THREE.Fog(new THREE.Color('rgb(100,100,150)'), 0, 60)
    this.scene.add(this.camera)
    this.scene.add(this.light)
  }
  initStats() {
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = '0px'
    this.dom.appendChild(this.stats.dom)
  }
  initScene = () => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    return scene
  }
  initCamera = () => {
    const cameraConfig = this.camConfig
    const domElement = this.dom
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
    const domElement = this.dom
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: 'highp',
      logarithmicDepthBuffer: true
    })
    renderer.setSize(domElement.clientWidth, domElement.clientHeight)
    domElement.appendChild(renderer.domElement)
    return renderer
  }
  initControls = () => {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true // 手动操作更顺滑
    // controls.update()
    // controls.enabled = true
    // controls.enableZoom = true
    // controls.enablePan = true
    // controls.enableRotate = true
    // controls.minDistance = 40
    // controls.maxDistance = 80
    return controls
  }
  initLight = () => {
    // 环境光
    const AmbientLight = new THREE.AmbientLight('#fff')
    return AmbientLight
  }
  clearScene = (scene: THREE.Object3D) => {
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
  loadModel = async () => {
    const modelUrl = await API.getModel()
    console.log(modelUrl.data instanceof Array)

    modelUrl.data.forEach((url: string) => {
      new GLTFLoader(this.loadingManager).load(url, (gltf) => {
        this.scene.add(gltf.scene)
        this.scene.traverse((obj) => {
          if (obj.type === 'Mesh') {
            if (obj.name === 'ground') {
              this.worldOctree.fromGraphNode(obj)
            }
          }
        })
        this.loadingManager.onLoad = () => {
          console.log('模型加载完毕')
        }
      })
    })
    return
  }
}
