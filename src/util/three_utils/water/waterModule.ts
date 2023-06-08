import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water'
import img from '../../../assets/img/waternormals.jpg'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { InitSkyModule } from '../sky/skyModule'
export class InitWaterModule {
  water!: Water
  pmremGenerator!: THREE.PMREMGenerator
  renderTarget?: THREE.WebGLRenderTarget
  constructor(
    public skyModule: InitSkyModule,
    public scene: THREE.Scene,
    public renderer: THREE.WebGLRenderer,
    public gui: GUI
  ) {
    this.initWater()
  }
  initWater = () => {
    const waterGeometry = new THREE.PlaneGeometry(100, 100)

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(img, function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: this.scene.fog !== undefined,
    })

    this.water.rotation.x = -Math.PI / 2
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    this.water.position.setY(-9.3)
    this.scene.add(this.water)
    this.updateWater()

    const waterUniforms = this.water.material.uniforms
    waterUniforms.size.value = 10
    const folderWater = this.gui.addFolder('Water')
    folderWater
      .add(waterUniforms.distortionScale, 'value', 0, 8, 0.1)
      .name('distortionScale')
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size')
    folderWater.add(this.water.position,'y',-100,100,.1)
    folderWater.open()
  }

  updateWater = () => {
    this.water.material.uniforms['sunDirection'].value
      .copy(this.skyModule.sun)
      .normalize()

    if (this.renderTarget !== undefined) this.renderTarget.dispose()

    console.log(this.skyModule)
    this.renderTarget = this.pmremGenerator.fromScene(this.skyModule.sky as any)
    this.scene.environment = this.renderTarget.texture
  }

  animate = () => {
    this.water.material.uniforms['time'].value += 1.0 / 60.0
  }
}
