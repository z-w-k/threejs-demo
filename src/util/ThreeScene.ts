import { FpsControls } from './three_utils/roam/roamModule'
import { InitBloomModule } from './three_utils/post/bloom/bloomModule'
import { ThreeBase } from './three_utils/threeBase'
import { InitSkyModule } from './three_utils/sky/skyModule'
import * as THREE from 'three'
import { InitWaterModule } from './three_utils/water/waterModule'
import { InitGodRayModule } from './three_utils/god_ray/godRay'
import { InitOutlineModule } from './three_utils/post/outline/outline'

import lmJPG from '../assets/img/lm.jpg'
import rPNG from '../assets/img/R.png'
import { MainStore } from '../store/mainStore'
import router from '../router'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { API } from '../api/api'

export interface CameraConfig {
  fov: number
  near: number
  far: number
}
class ThreeScene extends ThreeBase {
  bloomModule: InitBloomModule
  skyModule: InitSkyModule
  waterModule!: InitWaterModule
  fpsControls: FpsControls
  // outlineModule: InitOutlineModule
  // godRayModule: InitGodRayModule
  fpsStatus = false
  controlsStatus = true

  constructor(
    domElement: HTMLElement,
    cameraConfig: CameraConfig = { fov: 60, near: 0.1, far: 1500 }
  ) {
    super(domElement, cameraConfig)
    const {
      scene,
      camera,
      renderer,
      stats,
      gui,
      worldOctree,
      controls,
      commonGUI,
      dirLight,
      waterModel
    } = this
    this.bloomModule = new InitBloomModule(domElement, scene, camera, renderer)
    this.fpsControls = new FpsControls(
      domElement,
      scene,
      camera,
      gui,
      commonGUI,
      worldOctree
    )
    this.skyModule = new InitSkyModule(
      this.scene,
      this.camera,
      this.renderer,
      this.stats,
      this.gui,
      this.dirLight
    )

    this.waterModule = new InitWaterModule(
      this.skyModule,
      this.scene,
      this.renderer,
      this.gui,
      this.waterModel
    )
    // this.godRayModule = new InitGodRayModule(scene, camera, renderer, this.gui)
    // this.outlineModule = new InitOutlineModule(scene, camera, renderer, gui)
    // this.initTest()

    camera.position.set(5, 2, 0)
    controls.target.set(0, 0, 0)
    controls.update()
  }
  useLoadModel = async () => {
    const mainStore = MainStore()

    const GLTFOnProgress = (url: string, loaded: number, total: number) => {
      const progress = (loaded / total) * 100
      if (url.startsWith('/model')) {
        const modelName = url.substring(url.lastIndexOf('/') + 1)
        mainStore.loadingProgress.name = modelName
      }
      mainStore.loadingProgress.progress = Number(progress.toFixed(2))
    }
    const GLTFOnError = (url: string) => {
      console.log(`加载 Error`, url)
    }
    const GLTFOnLoaded = () => {
      console.log('全部模型加载完毕')

      router.replace({ name: 'menu' })
      mainStore.isLoading = false
    }

    const GLTFloadingManager = new THREE.LoadingManager(
      GLTFOnLoaded,
      GLTFOnProgress,
      GLTFOnError
    )

    const GLTFLoaderIns = new GLTFLoader(GLTFloadingManager)

    const modelUrl = await API.getModel()
    modelUrl.data.forEach((url: string) => this.loadModel(url, GLTFLoaderIns))
    return
  }
  initTest() {
    {
      // const geo = new THREE.BufferGeometry()
      // const face1 = [1, 0, 0, 0, 1, 0, 0, 0, 1]
      // const face2 = [1, 0, 0, 0, 1, 0, 0, 0, -1]
      // const face3 = [-1, 0, 0, 0, 1, 0, 0, 0, 1]
      // const face4 = [-1, 0, 0, 0, 1, 0, 0, 0, -1]
      // const vertices = new Float32Array([face1, face2, face3, face4].flat(1))
      // geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      // const mate = new THREE.MeshBasicMaterial({
      //   color: 'pink',
      //   side: THREE.DoubleSide
      // })
      // const testGeo = new THREE.Mesh(geo, mate)
      // this.dirLight.add(testGeo)
      // this.controls.target.copy(testGeo.position)
    }
    {
      // const group = new THREE.Group()
      // for (let i = 0; i < 50; i++) {
      //   const bufferGeo = new THREE.BufferGeometry()
      //   const vertices = new Float32Array(9)
      //   for (let j = 0; j < 9; j++) {
      //     vertices[j] = Math.random() * 6 - 3
      //   }
      //   bufferGeo.setAttribute(
      //     'position',
      //     new THREE.BufferAttribute(vertices, 3)
      //   )
      //   const color = new THREE.Color(
      //     Math.random(),
      //     Math.random(),
      //     Math.random()
      //   )
      //   const material = new THREE.MeshBasicMaterial({ color: color })
      //   const trigon = new THREE.Mesh(bufferGeo, material)
      //   group.add(trigon)
      // }
      // group.name = '三角阵'
      // console.log(group)
      // this.scene.add(group)
    }
    {
      const textureLoader = new THREE.TextureLoader()
      const lineTexture = textureLoader.load(rPNG)
      // lineTexture.center.set(0.5, 0.5)
      // lineTexture.offset.y = 0.5
      // lineTexture.offset.x = -0.5
      // lineTexture.rotation = Math.PI / 6
      // lineTexture.repeat.set(2, 2)
      // lineTexture.wrapS = THREE.MirroredRepeatWrapping
      // lineTexture.wrapT = THREE.RepeatWrapping
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
      const Material = new THREE.MeshBasicMaterial({
        color: '#fff',
        map: lineTexture
      })
      const cube = new THREE.Mesh(cubeGeometry, Material)
      console.log(lineTexture)
      this.scene.add(cube)
    }
  }

  onWindowResize = () => {
    this.camera.aspect =
      this.domElement.clientWidth / this.domElement.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(
      this.domElement.clientWidth,
      this.domElement.clientHeight
    )
    // this.outlineModule.onWindowResize()
    // this.godRayModule.onWindowResize()
  }
  enterFps = () => {
    this.controls.enabled = false
    this.controlsStatus = false
    this.fpsStatus = true
    const playerCollider = this.fpsControls.playerCollider
    playerCollider.start.copy(this.camera.position)
    playerCollider.end.copy(this.camera.position)
    playerCollider.start.y -= 0.6
  }
  enterOrbit = () => {
    this.fpsStatus = false
    // const cwd = new THREE.Vector3()
    // this.camera.getWorldDirection(cwd)
    // const cp = this.camera.position
    // const tar: [number, number, number] = [
    //   cp.x + cwd.x,
    //   cp.y + cwd.y,
    //   cp.z + cwd.z
    // ]
    // this.controls.target.set(...tar)
    // this.controls.update()
    this.controlsStatus = true
    this.controls.enabled = true
  }

  animate = () => {
    this.stats.update()
    // this.godRayModule.animate()
    // this.outlineModule.animate()
    this.skyModule.animate()
    this.fpsStatus && this.fpsControls.animate()
    this.controlsStatus &&
      (this.controls.update(),
      this.axesHelper.position.copy(this.controls.target))
    this.waterModule.animate()
    this.bloomModule.animate()
  }
}

export default ThreeScene
