import { FpsControls } from './three_utils/roam/roamModule'
import { InitBloomModule } from './three_utils/post/bloom/bloomModule'
import { ThreeBase } from './three_utils/threeBase'
import { InitSkyModule } from './three_utils/sky/skyModule'
import * as THREE from 'three'
import { InitWaterModule } from './three_utils/water/waterModule'
import { InitGodRayModule } from './three_utils/god_ray/godRay'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

export interface CameraConfig {
  fov: number
  near: number
  far: number
}
class ThreeScene extends ThreeBase {
  bloomModule: InitBloomModule
  skyModule: InitSkyModule
  waterModule: InitWaterModule
  fpsControls: FpsControls
  // godRayModule: InitGodRayModule
  fpsStatus = false
  controlsStatus = true

  group = new THREE.Group()
  params = {
    edgeStrength: 3.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    rotate: false,
    usePatternTexture: false
  }
  effectFXAA = new ShaderPass(FXAAShader)
  composer!: EffectComposer
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
    this.skyModule = new InitSkyModule(scene, camera, renderer, stats, gui)
    this.waterModule = new InitWaterModule(this.skyModule, scene, renderer, gui)
    // this.godRayModule = new InitGodRayModule(scene, camera, renderer, this.gui)

    camera.position.set(5, 2, 0)
    controls.target.set(0, 0, 0)
    controls.update()

    let outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    )
    let selectedObjects: THREE.Object3D<THREE.Event>[] = []

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const params = this.params
    gui
      .add(params, 'edgeStrength', 0.01, 10)
      .onChange(function (value: string) {
        outlinePass.edgeStrength = Number(value)
      })

    gui.add(params, 'edgeGlow', 0.0, 1).onChange(function (value: string) {
      outlinePass.edgeGlow = Number(value)
    })

    gui.add(params, 'edgeThickness', 1, 4).onChange(function (value: string) {
      outlinePass.edgeThickness = Number(value)
    })

    gui.add(params, 'pulsePeriod', 0.0, 5).onChange(function (value: string) {
      outlinePass.pulsePeriod = Number(value)
    })

    gui.add(params, 'rotate')

    gui.add(params, 'usePatternTexture').onChange(function (value: boolean) {
      outlinePass.usePatternTexture = value
    })

    const conf = {
      visibleEdgeColor: '#ffffff',
      hiddenEdgeColor: '#190a05'
    }

    gui
      .addColor(conf, 'visibleEdgeColor')
      .onChange(function (value: THREE.ColorRepresentation) {
        outlinePass.visibleEdgeColor.set(value)
      })

    gui
      .addColor(conf, 'hiddenEdgeColor')
      .onChange(function (value: THREE.ColorRepresentation) {
        outlinePass.hiddenEdgeColor.set(value)
      })
    const composer = (this.composer = new EffectComposer(renderer))
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    composer.addPass(outlinePass)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('textures/tri_pattern.jpg', function (texture) {
      outlinePass.patternTexture = texture
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
    })

    const gammaPass = new ShaderPass(GammaCorrectionShader)
    composer.addPass(gammaPass)
    const effectFXAA = this.effectFXAA
    effectFXAA.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    )
    composer.addPass(effectFXAA)

    window.addEventListener('resize', this.onWindowResize)

    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.addEventListener('pointermove', onPointerMove)

    function onPointerMove(event: PointerEvent) {
      console.log(event)

      if (event.isPrimary === false) return

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      checkIntersection()
    }

    function addSelectedObject(object: THREE.Object3D<THREE.Event>) {
      selectedObjects = []
      selectedObjects.push(object)
    }

    function checkIntersection() {
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObject(scene, true)

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object
        addSelectedObject(selectedObject)
        outlinePass.selectedObjects = selectedObjects
      } else {
        // outlinePass.selectedObjects = [];
      }
    }
  }

  onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const camera = this.camera

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)

    this.effectFXAA.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    )
  }

  // onWindowResize = () => {
  //   this.camera.aspect =
  //     this.domElement.clientWidth / this.domElement.clientHeight
  //   this.camera.updateProjectionMatrix()
  //   this.renderer.setSize(
  //     this.domElement.clientWidth,
  //     this.domElement.clientHeight
  //   )
  //   // this.godRayModule.onWindowResize()
  // }
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
    const timer = performance.now()

    if (this.params.rotate) {
      this.group.rotation.y = timer * 0.0001
    }

    this.composer.render()

    this.stats.update()
    // this.godRayModule.animate()
    this.fpsStatus && this.fpsControls.animate()
    this.controlsStatus &&
      (this.controls.update(),
      this.axesHelper.position.copy(this.controls.target))
    this.waterModule.animate()
    this.bloomModule.animate()
  }
}

export default ThreeScene
