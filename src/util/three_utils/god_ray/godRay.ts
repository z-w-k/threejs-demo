import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import {
  GodRaysFakeSunShader,
  GodRaysDepthMaskShader,
  GodRaysCombineShader,
  GodRaysGenerateShader
} from 'three/examples/jsm/shaders/GodRaysShader.js'
export class InitGodRayModule {
  sunPosition = new THREE.Vector3(0, 1000, -1000)
  clipPosition = new THREE.Vector4()
  screenSpacePosition = new THREE.Vector3()
  orbitRadius = 200
  bgColor = 0x005511
  sunColor = 0xffee00
  godrayRenderTargetResolutionMultiplier = 1.0 / 4.0
  materialDepth = new THREE.MeshDepthMaterial()
  postprocessing: {
    enabled: boolean
    scene: THREE.Scene
    camera: THREE.OrthographicCamera
    rtTextureColors: THREE.WebGLRenderTarget
    rtTextureDepth: THREE.WebGLRenderTarget
    rtTextureDepthMask: THREE.WebGLRenderTarget
    rtTextureGodRays1: THREE.WebGLRenderTarget
    rtTextureGodRays2: THREE.WebGLRenderTarget
    godrayMaskUniforms: any
    godrayGenUniforms: any
    materialGodraysDepthMask: THREE.ShaderMaterial
    materialGodraysGenerate: THREE.ShaderMaterial
    godrayCombineUniforms: any
    materialGodraysCombine: THREE.ShaderMaterial
    godraysFakeSunUniforms: any
    materialGodraysFakeSun: THREE.ShaderMaterial
    quad: THREE.Mesh
  }
  constructor(
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public gui: GUI
  ) {
    const renderTargetWidth = window.innerWidth
    const renderTargetHeight = window.innerHeight

    const adjustedWidth =
      renderTargetWidth * this.godrayRenderTargetResolutionMultiplier
    const adjustedHeight =
      renderTargetHeight * this.godrayRenderTargetResolutionMultiplier

    const godraysMaskShader = GodRaysDepthMaskShader
    const godraysGenShader = GodRaysGenerateShader

    const godrayMaskUniforms = THREE.UniformsUtils.clone(
      godraysMaskShader.uniforms
    )
    const godrayGenUniforms = THREE.UniformsUtils.clone(
      godraysGenShader.uniforms
    )
    const godraysCombineShader = GodRaysCombineShader
    console.log(godraysCombineShader.uniforms)

    const godrayCombineUniforms = THREE.UniformsUtils.clone(
      godraysCombineShader.uniforms
    )
    const godraysFakeSunShader = GodRaysFakeSunShader
    const godraysFakeSunUniforms = THREE.UniformsUtils.clone(
      godraysFakeSunShader.uniforms
    )
    const materialGodraysGenerate = new THREE.ShaderMaterial({
      uniforms: godrayGenUniforms,
      vertexShader: godraysGenShader.vertexShader,
      fragmentShader: godraysGenShader.fragmentShader
    })
    this.postprocessing = {
      enabled: true,
      scene: new THREE.Scene(),
      camera: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000),
      rtTextureColors: new THREE.WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight,
        { type: THREE.HalfFloatType }
      ),
      rtTextureDepth: new THREE.WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight,
        { type: THREE.HalfFloatType }
      ),
      rtTextureDepthMask: new THREE.WebGLRenderTarget(
        renderTargetWidth,
        renderTargetHeight,
        { type: THREE.HalfFloatType }
      ),
      rtTextureGodRays1: new THREE.WebGLRenderTarget(
        adjustedWidth,
        adjustedHeight,
        { type: THREE.HalfFloatType }
      ),
      rtTextureGodRays2: new THREE.WebGLRenderTarget(
        adjustedWidth,
        adjustedHeight,
        { type: THREE.HalfFloatType }
      ),
      godrayMaskUniforms,
      godrayGenUniforms,
      materialGodraysDepthMask: new THREE.ShaderMaterial({
        uniforms: godrayMaskUniforms,
        vertexShader: godraysMaskShader.vertexShader,
        fragmentShader: godraysMaskShader.fragmentShader
      }),
      materialGodraysGenerate,
      godrayCombineUniforms,
      materialGodraysCombine: new THREE.ShaderMaterial({
        uniforms: godrayCombineUniforms,
        vertexShader: godraysCombineShader.vertexShader,
        fragmentShader: godraysCombineShader.fragmentShader
      }),
      godraysFakeSunUniforms,
      materialGodraysFakeSun: new THREE.ShaderMaterial({
        uniforms: godraysFakeSunUniforms,
        vertexShader: godraysFakeSunShader.vertexShader,
        fragmentShader: godraysFakeSunShader.fragmentShader
      }),
      quad: new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.0),
        materialGodraysGenerate
      )
    }

    this.init()
  }

  init = () => {
    const renderer = this.renderer

    renderer.setClearColor(0xffffff)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.autoClear = false
    this.initPostprocessing()
  }
  initPostprocessing = () => {
    const postprocessing = this.postprocessing

    postprocessing.camera.position.z = 100

    postprocessing.scene.add(postprocessing.camera)

    // pars.format = LuminanceFormat;

    // I would have this quarter size and use it as one of the ping-pong render
    // targets but the aliasing causes some temporal flickering
    // The ping-pong render targets can use an adjusted resolution to minimize cost

    // god-ray shaders

    postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(this.bgColor)
    postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(this.sunColor)

    postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.1

    postprocessing.quad.position.z = -9900
    postprocessing.scene.add(postprocessing.quad)
  }

  getStepSize = (filterLen: number, tapsPerPass: number, pass: number) => {
    return filterLen * Math.pow(tapsPerPass, -pass)
  }
  filterGodRays = (
    inputTex: THREE.Texture,
    renderTarget: THREE.WebGLRenderTarget,
    stepSize: number
  ) => {
    const postprocessing = this.postprocessing
    const renderer = this.renderer
    const scene = postprocessing.scene!
    scene.overrideMaterial = postprocessing.materialGodraysGenerate!

    postprocessing.godrayGenUniforms['fStepSize'].value = stepSize
    postprocessing.godrayGenUniforms['tInput'].value = inputTex

    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, postprocessing.camera!)
    scene.overrideMaterial = null
  }
  render = () => {
    const postprocessing = this.postprocessing
    const clipPosition = this.clipPosition
    const sunPosition = this.sunPosition
    const screenSpacePosition = this.screenSpacePosition
    const scene = this.scene
    const camera = this.camera
    const renderer = this.renderer
    const filterGodRays = this.filterGodRays
    const getStepSize = this.getStepSize

    if (postprocessing.enabled) {
      clipPosition.x = sunPosition.x
      clipPosition.y = sunPosition.y
      clipPosition.z = sunPosition.z
      clipPosition.w = 1

      clipPosition
        .applyMatrix4(camera.matrixWorldInverse)
        .applyMatrix4(camera.projectionMatrix)

      // perspective divide (produce NDC space)

      clipPosition.x /= clipPosition.w
      clipPosition.y /= clipPosition.w

      screenSpacePosition.x = (clipPosition.x + 1) / 2 // transform from [-1,1] to [0,1]
      screenSpacePosition.y = (clipPosition.y + 1) / 2 // transform from [-1,1] to [0,1]
      screenSpacePosition.z = clipPosition.z // needs to stay in clip space for visibilty checks

      // Give it to the god-ray and sun shaders

      postprocessing.godrayGenUniforms['vSunPositionScreenSpace'].value.copy(
        screenSpacePosition
      )
      postprocessing.godraysFakeSunUniforms[
        'vSunPositionScreenSpace'
      ].value.copy(screenSpacePosition)

      // -- Draw sky and sun --

      // Clear colors and depths, will clear to sky color

      renderer.setRenderTarget(postprocessing.rtTextureColors)
      renderer.clear(true, true, false)

      // Sun render. Runs a shader that gives a brightness based on the screen
      // space distance to the sun. Not very efficient, so i make a scissor
      // rectangle around the suns position to avoid rendering surrounding pixels.

      const sunsqH = 0.74 * window.innerHeight // 0.74 depends on extent of sun from shader
      const sunsqW = 0.74 * window.innerHeight // both depend on height because sun is aspect-corrected

      screenSpacePosition.x *= window.innerWidth
      screenSpacePosition.y *= window.innerHeight

      renderer.setScissor(
        screenSpacePosition.x - sunsqW / 2,
        screenSpacePosition.y - sunsqH / 2,
        sunsqW,
        sunsqH
      )
      renderer.setScissorTest(true)

      postprocessing.godraysFakeSunUniforms['fAspect'].value =
        window.innerWidth / window.innerHeight

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysFakeSun
      renderer.setRenderTarget(postprocessing.rtTextureColors)
      renderer.render(postprocessing.scene, postprocessing.camera)

      renderer.setScissorTest(false)

      // -- Draw scene objects --

      // Colors

      scene.overrideMaterial = null
      renderer.setRenderTarget(postprocessing.rtTextureColors)
      renderer.render(scene, camera)

      // Depth

      scene.overrideMaterial = this.materialDepth
      renderer.setRenderTarget(postprocessing.rtTextureDepth)
      renderer.clear()
      renderer.render(scene, camera)

      //

      postprocessing.godrayMaskUniforms['tInput'].value =
        postprocessing.rtTextureDepth.texture

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysDepthMask
      renderer.setRenderTarget(postprocessing.rtTextureDepthMask)
      renderer.render(postprocessing.scene, postprocessing.camera)

      // -- Render god-rays --

      // Maximum length of god-rays (in texture space [0,1]X[0,1])

      const filterLen = 1.0

      // Samples taken by filter

      const TAPS_PER_PASS = 6.0

      // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
      // would start with a small filter support and grow to large. however
      // the large-to-small order produces less objectionable aliasing artifacts that
      // appear as a glimmer along the length of the beams

      // pass 1 - render into first ping-pong target

      filterGodRays(
        postprocessing.rtTextureDepthMask.texture,
        postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 1.0)
      )

      // pass 2 - render into second ping-pong target
      filterGodRays(
        postprocessing.rtTextureGodRays2.texture,
        postprocessing.rtTextureGodRays1,
        getStepSize(filterLen, TAPS_PER_PASS, 2.0)
      )

      // pass 3 - 1st RT
      filterGodRays(
        postprocessing.rtTextureGodRays1.texture,
        postprocessing.rtTextureGodRays2,
        getStepSize(filterLen, TAPS_PER_PASS, 3.0)
      )

      // final pass - composite god-rays onto colors

      postprocessing.godrayCombineUniforms['tColors'].value =
        postprocessing.rtTextureColors.texture
      postprocessing.godrayCombineUniforms['tGodRays'].value =
        postprocessing.rtTextureGodRays2.texture

      postprocessing.scene.overrideMaterial =
        postprocessing.materialGodraysCombine

      renderer.setRenderTarget(null)
      renderer.render(postprocessing.scene, postprocessing.camera)
      postprocessing.scene.overrideMaterial = null
    } else {
      renderer.setRenderTarget(null)
      renderer.clear()
      renderer.render(scene, camera)
    }
  }

  onWindowResize = () => {
    const renderTargetWidth = window.innerWidth
    const renderTargetHeight = window.innerHeight

    const postprocessing = this.postprocessing
    this.renderer.setSize(renderTargetWidth, renderTargetHeight)
    postprocessing.rtTextureColors.setSize(
      renderTargetWidth,
      renderTargetHeight
    )
    postprocessing.rtTextureDepth.setSize(renderTargetWidth, renderTargetHeight)
    postprocessing.rtTextureDepthMask.setSize(
      renderTargetWidth,
      renderTargetHeight
    )

    const adjustedWidth =
      renderTargetWidth * this.godrayRenderTargetResolutionMultiplier
    const adjustedHeight =
      renderTargetHeight * this.godrayRenderTargetResolutionMultiplier
    postprocessing.rtTextureGodRays1.setSize(adjustedWidth, adjustedHeight)
    postprocessing.rtTextureGodRays2.setSize(adjustedWidth, adjustedHeight)
  }
  animate = () => {
    this.render()
  }
}
