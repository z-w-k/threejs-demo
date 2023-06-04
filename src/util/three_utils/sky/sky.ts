import { Sky } from 'three/examples/jsm/objects/Sky'
import * as THREE from 'three'
import ThreeScene from '../../ThreeScene'
import { ThreeBaseApi } from '../baseAPI'
import { propsTransfer } from '../transfer'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

export class InitSky {
  sky = new Sky()
  sun = new THREE.Vector3()

  constructor(
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public stats: Stats,
    public gui: GUI
  ) {
    this.initSky()
  }
  initSky() {
    // Add Sky
    const sky = this.sky
    sky.scale.setScalar(450000)
    this.scene.add(sky)
    /// GUI

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
      exposure: this.renderer.toneMappingExposure
    }
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

    const gui = this.gui

    gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged)
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged)
    gui
      .add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(guiChanged)
    gui
      .add(effectController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(guiChanged)
    gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged)
    gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged)
    gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged)

    guiChanged()
  }
}
