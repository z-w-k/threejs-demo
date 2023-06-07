import { FpsControls } from './three_utils/roam/firstPlayer'
import { InitBloom } from './three_utils/post/bloom/bloom'
import { ThreeBase } from './three_utils/threeBase'
import { InitSky } from './three_utils/sky/sky'
import { Vector3 } from 'three'
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
    public cameraConfig: CameraConfig = { fov: 60, near: 0.1, far: 1500 }
  ) {
    super(domElement, cameraConfig)
    const { scene, camera, renderer, stats, gui, worldOctree, controls } = this
    this.bloom = new InitBloom(domElement, scene, camera, renderer)
    this.fpsControls = new FpsControls(
      domElement,
      scene,
      camera,
      gui,
      worldOctree
    )
    this.sky = new InitSky(scene, camera, renderer, stats, gui)
    console.log(this.fpsControls)
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
  enterFps = () => {
    const playerCollider = this.fpsControls.playerCollider
    playerCollider.start.copy(this.camera.position)
    playerCollider.end.copy(this.camera.position)
    playerCollider.end.y += 0.6
  }
  enterOrbit = () => {
    const cwd = new Vector3()
    this.camera.getWorldDirection(cwd)
    const cp = this.camera.position
    this.controls.target.copy(
      new Vector3(
        cp.x + cwd.x * 10,
        cp.y + cwd.y * 10,
        cp.z + cwd.z * 10
      )
    )
  }
  animate = (isEnter: boolean) => {
    this.stats.update()
    if (isEnter) {
      this.fpsControls.animate()
    } else {
      this.controls.update()
    }
    this.bloom.animate()
  }
}

export default ThreeScene
