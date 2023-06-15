import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import outlineJPG from '../../../../assets/img/tri_pattern.jpg'

export class InitOutlineModule {
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
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public gui: GUI
  ) {
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
    textureLoader.load(outlineJPG, function (texture) {
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
    this.composer.setSize(width, height)
    this.effectFXAA.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    )
  }

  animate = () => {
    const timer = performance.now()

    if (this.params.rotate) {
      this.group.rotation.y = timer * 0.0001
    }

    this.composer.render()
  }
}
