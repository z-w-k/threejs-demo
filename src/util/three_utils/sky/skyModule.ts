import { Sky } from 'three/examples/jsm/objects/Sky'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import _ from 'lodash'

export class InitSkyModule {
  sky = new Sky()
  sun = new THREE.Vector3()
  sunset = false
  effectController = {
    turbidity: 0.9,
    rayleigh: 4,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.99,
    elevation: 63.9,
    azimuth: 180,
    // exposure: 0.4269
    exposure: 0.5
  }
  constructor(
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public stats: Stats,
    public gui: GUI,
    public dirLight: THREE.DirectionalLight
  ) {
    this.initSky()
  }
  initSky() {
    const guiChanged = this.guiChanged
    // Add Sky
    const sky = this.sky
    // sky.scale.setScalar(4500)
    sky.scale.setScalar(450000)

    this.scene.add(sky)

    /// GUI
    const effectController = this.effectController

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

  guiChanged = () => {
    const sky = this.sky
    const effectController = this.effectController
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
  timeTravel = _.throttle(() => {
    this.sunset
      ? (this.effectController.elevation -= 0.001)
      : (this.effectController.elevation += 0.001)

    if (this.effectController.elevation > 89) {
      this.effectController.azimuth = 0
      this.sunset = true
      return
    }

    if (this.effectController.elevation < 1) {
      this.effectController.azimuth = 180
      this.sunset = false
      return
    }
    this.guiChanged()
    this.dirLight.position.copy(this.sun).multiplyScalar(100)
  }, 0)

  animate = () => {
    this.timeTravel()
  }
}
