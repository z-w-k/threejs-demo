import { Sky } from 'three/examples/jsm/objects/Sky'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

export class InitSkyModule {
  sky = new Sky()
  sun = new THREE.Vector3()
  change = true
  effectController = {
    turbidity: 0.9,
    rayleigh: 4,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.99,
    elevation: 63.9,
    azimuth: 180,
    // exposure: 0.4269
    exposure: 1
  }
  constructor(
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public stats: Stats,
    public gui: GUI
  ) {
    this.initSky()
  }
  initDir() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024 // default
    directionalLight.shadow.mapSize.height = 1024 // default

    // 设置三维场景计算阴影的范围
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 200
    directionalLight.shadow.camera.bottom = -200
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 1200

    directionalLight.position.setY(1000)
    console.log(directionalLight)

    return directionalLight
  }
  initSky() {
    // Add Sky
    const sky = this.sky
    // sky.scale.setScalar(4500)
    sky.scale.setScalar(450000)
    const dir = this.initDir()
    this.scene.add(dir)

    this.scene.add(sky)

    /// GUI
    const effectController = this.effectController

    const guiChanged = () => {
      const uniforms = sky.material.uniforms
      uniforms['turbidity'].value = effectController.turbidity
      uniforms['rayleigh'].value = effectController.rayleigh
      uniforms['mieCoefficient'].value = effectController.mieCoefficient
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
      const theta = THREE.MathUtils.degToRad(effectController.azimuth)

      this.sun.setFromSphericalCoords(1, phi, theta)

      uniforms['sunPosition'].value.copy(this.sun)

      this.renderer.toneMappingExposure = effectController.exposure
      this.renderer.render(this.scene, this.camera)
    }

    const skyFolder = this.gui.addFolder('skyFolder')

    skyFolder
      .add(effectController, 'turbidity', 0.0, 20.0, 0.1)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'rayleigh', 0.0, 4, 0.001)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'elevation', 0, 90, 0.1)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'azimuth', -180, 180, 0.1)
      .onChange(guiChanged)
    skyFolder
      .add(effectController, 'exposure', 0, 50, 0.0001)
      .onChange(guiChanged)
    skyFolder.open()
    guiChanged()
  }
  animate = () => {
    if (this.effectController.elevation > 89) {
      this.effectController.azimuth = 0
      this.change = true
    }

    if (this.effectController.elevation < 1) {
      this.effectController.azimuth = 180
      this.change = false
    }
    console.log(this.effectController)

    this.change
      ? (this.effectController.elevation -= 1)
      : (this.effectController.elevation += 1)
  }
}
