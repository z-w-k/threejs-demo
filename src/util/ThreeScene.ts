import { FpsControls } from './three_utils/roam/roamModule'
import { InitBloomModule } from './three_utils/post/bloom/bloomModule'
import { ThreeBase } from './three_utils/threeBase'
import { InitSkyModule } from './three_utils/sky/skyModule'
import * as THREE from 'three'
import { InitWaterModule } from './three_utils/water/waterModule'
import { InitGodRayModule } from './three_utils/god_ray/godRay'

export interface CameraConfig {
  fov: number
  near: number
  far: number
}
class ThreeScene extends ThreeBase {
  bloomModule: InitBloomModule
  // skyModule: InitSkyModule
  // waterModule: InitWaterModule
  fpsControls: FpsControls
  godRayModule: InitGodRayModule
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
      commonGUI
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
    // this.skyModule = new InitSkyModule(scene, camera, renderer, stats, gui)
    // this.waterModule = new InitWaterModule(this.skyModule, scene, renderer, gui)
    this.godRayModule = new InitGodRayModule(scene, camera, renderer, this.gui)

    camera.position.set(5, 2, 0)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  onWindowResize = () => {
    this.camera.aspect =
      this.domElement.clientWidth / this.domElement.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(
      this.domElement.clientWidth,
      this.domElement.clientHeight
    )
    this.godRayModule.onWindowResize()
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
    const cwd = new THREE.Vector3()
    this.camera.getWorldDirection(cwd)
    const cp = this.camera.position
    const tar: [number, number, number] = [
      cp.x + cwd.x,
      cp.y + cwd.y,
      cp.z + cwd.z
    ]
    this.controls.target.set(...tar)
    this.controls.update()
    this.controlsStatus = true
    this.controls.enabled = true
  }
  animate = () => {
    this.stats.update()
    this.godRayModule.animate()
    this.fpsStatus && this.fpsControls.animate()
    this.controlsStatus &&
      (this.controls.update(),
      this.axesHelper.position.copy(this.controls.target))
    // this.waterModule.animate()
    // this.bloomModule.animate()
  }
}

export default ThreeScene
