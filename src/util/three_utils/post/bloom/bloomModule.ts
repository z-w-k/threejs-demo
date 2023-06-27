import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

export class InitBloomModule {
  bloomComposer!: EffectComposer
  finalComposer!: EffectComposer
  materials: {
    [arg: string]:
      | THREE.Material
      | THREE.Material[]
      | THREE.Texture
      | THREE.Color
      | THREE.CubeTexture
      | null
  } = {} // 跟辉光光晕有关的变量
  bloomIgnore = new Array() // 跟辉光光晕有关的变量
  bloomLayer = new THREE.Layers() // 跟辉光光晕有关的变量
  darkMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.Texture()
  }) // 跟辉光光晕有关的变量
  constructor(
    public domElement: HTMLElement,
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer
  ) {
    this.initBloom()
  }
  initBloom = () => {
    const params = {
      // 跟辉光光晕有关的变量
      exposure: 0.5,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    }

    const ENTIRE_SCENE = 0
    const BLOOM_SCENE = 1 // 跟辉光光晕有关的变量
    this.bloomComposer = new EffectComposer(this.renderer) // EffectComposer可以理解为着色器通道容器，着色器通道按照先后顺序添加进来并执行
    this.finalComposer = new EffectComposer(this.renderer)

    const bloomComposer = this.bloomComposer
    const finalComposer = this.finalComposer

    this.bloomLayer.set(BLOOM_SCENE)

    // 去掉锯齿---1
    // 通过ShaderPass构造函数把FXAAShader着色器和uniforms构成的对象作为参数，创建一个锯齿通道FXAAShaderPass,然后把锯齿通道插入到composer中。
    const effectFXAA = new ShaderPass(FXAAShader)
    effectFXAA.uniforms['resolution'].value.set(
      0.6 / window.innerWidth,
      0.6 / window.innerHeight
    ) // 渲染区域Canvas画布宽高度  不一定是全屏，也可以是区域值
    effectFXAA.renderToScreen = true
    // 去掉锯齿---1
    const renderScene = new RenderPass(this.scene, this.camera) // RenderPass这个通道会在当前场景（scene）和摄像机（camera）的基础上渲染出一个新场景，新建：
    // 添加光晕效果---2
    let bloomPass = new UnrealBloomPass( // UnrealBloomPass通道可实现一个泛光效果。
      new THREE.Vector2(
        this.domElement.clientWidth,
        this.domElement.clientHeight
      ),
      2,
      1,
      1
    )
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
    // 添加光晕效果---2
    // 着色器通道容器--放进容器里
    bloomComposer.renderToScreen = false
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass) // 添加光晕效果
    bloomComposer.addPass(effectFXAA) // 去掉锯齿
    // 着色器通道容器--放进容器里
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
        fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        }
      `,
        defines: {}
      }),
      'baseTexture'
    )
    finalPass.needsSwap = true
    finalComposer.addPass(renderScene)
    finalComposer.addPass(finalPass)
    finalComposer.addPass(effectFXAA)
  }
  darkenNonBloomed = (obj: THREE.Object3D<THREE.Event>) => {
    if (obj instanceof THREE.Scene) {
      // 此处忽略Scene，否则场景背景会被影响
      this.materials.scene = obj.background
      // obj.background = null
    }
    if (
      obj instanceof THREE.Sprite || // 此处忽略Sprite
      this.bloomIgnore.includes(obj.type) ||
      ((<THREE.Mesh>obj).isMesh && this.bloomLayer.test(obj.layers) === false) // 判断与辉光是否同层
    ) {
      this.materials[obj.uuid] = (<THREE.Mesh>obj).material
      ;(<THREE.Mesh>obj).material = this.darkMaterial
    }
  }
  restoreMaterial: (obj: THREE.Object3D<THREE.Event>) => any = (obj) => {
    const materials = this.materials
    if (obj instanceof THREE.Scene) {
      obj.background = materials.scene as
        | THREE.Texture
        | THREE.Color
        | THREE.CubeTexture
      delete materials.scene
    }
    if (materials[obj.uuid]) {
      ;(<THREE.Mesh>obj).material = materials[obj.uuid] as
        | THREE.Material
        | THREE.Material[]
      delete materials[obj.uuid]
    }
  }
  animate = () => {
    this.scene.traverse(this.darkenNonBloomed) // 隐藏不需要辉光的物体
    this.bloomComposer.render()
    this.scene.traverse(this.restoreMaterial) // 还原
    this.finalComposer.render()
  }
}
