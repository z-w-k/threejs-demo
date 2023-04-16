import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
interface cameraConfig {
  fov:number,
  near:number,
  far:number
}
class ThreeScene {
  domElement: HTMLElement
  scene: THREE.Scene
  camera:THREE.PerspectiveCamera
  renderer:THREE.Renderer
  controls:OrbitControls
  light:THREE.Light
  loadingManager:THREE.LoadingManager
  windowHalfX:number=0
  windowHalfY:number=0
  constructor(
    domElement: HTMLElement,
    cameraConfig:cameraConfig = { fov: 60, near: 0.1, far: 10000},
  ) {
    this.domElement = domElement
    this.scene = this.initScene()
    this.camera = this.initCamera(cameraConfig)
    this.renderer = this.initRenderer()
    this.controls = this.initControls()
    this.light = this.initLight()
    this.loadingManager = new THREE.LoadingManager()
  }
  initScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('black')
    return scene
  }
  initCamera(cameraConfig:cameraConfig) {
    new THREE.PerspectiveCamera()
    const camera = new THREE.PerspectiveCamera(
      cameraConfig.fov,
      this.domElement.clientWidth / this.domElement.clientHeight,
      cameraConfig.near,
      cameraConfig.far,
    )
    this.scene.add(camera)
    return camera
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: 'highp',
      logarithmicDepthBuffer: true,
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
    return  controls
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
  onWindowResize=() =>{
    this.windowHalfX = this.domElement.clientWidth / 2;
    this.windowHalfY = this.domElement.clientHeight / 2;
    this.camera.aspect = this.domElement.clientWidth / this.domElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.domElement.clientWidth,this.domElement.clientHeight );
  }
}

export default ThreeScene
