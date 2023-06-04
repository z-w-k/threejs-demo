import { FpsControls } from './three_utils/roam/firstPlayer'
import { InitBloom } from './three_utils/post/bloom/bloom'
import { ThreeBase } from './three_utils/threeBase'
import { InitSky } from './three_utils/sky/sky'
export interface CameraConfig {
  fov: number
  near: number
  far: number
}
class ThreeScene extends ThreeBase {
  windowHalfX: number = 0
  windowHalfY: number = 0
  bloom: InitBloom
  fpsControls: FpsControls
  sky: InitSky
  constructor(
    public domElement: HTMLElement,
    public cameraConfig: CameraConfig = { fov: 60, near: 0.1, far: 500 }
  ) {
    super(domElement, cameraConfig)
    const { scene, camera, renderer, stats, gui, worldOctree } = this
    this.bloom = new InitBloom(domElement, scene, camera, renderer)
    this.fpsControls = new FpsControls(
      domElement,
      scene,
      camera,
      gui,
      worldOctree
    )
    this.sky = new InitSky(scene, camera, renderer, stats, gui)
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

  animate = () => {
    this.stats.update()
    this.fpsControls.animate()
    this.bloom.animate()
  }
}

export default ThreeScene
