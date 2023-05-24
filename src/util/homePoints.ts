import * as THREE from 'three'
import ThreeScene from './ThreeScene'
import * as _ from 'lodash'
abstract class Attrs {
  abstract particles: THREE.Points
  protected SEPARATION: number = 5
  protected AMOUNTX: number = 5
  protected AMOUNTY: number = 5
  protected numParticles: number = this.AMOUNTX * this.AMOUNTY
  protected positions: Float32Array = new Float32Array(this.numParticles * 3)
  protected scales: Float32Array = new Float32Array(this.numParticles)
  protected count: number = 0
  protected i: number = 0
  protected j: number = 0
  protected mouseX: number = 2000
  protected mouseY: number = 2000
  protected windowHalfX: number
  protected windowHalfY: number
  protected stop: boolean = true
  constructor(
    protected domElement: HTMLElement,
    protected threeScene: ThreeScene
  ) {
    this.windowHalfX = domElement.clientWidth
    this.windowHalfY = domElement.clientHeight
  }
}
export default class HomePoints extends Attrs {
  particles: THREE.Points
  constructor(domElement: HTMLElement, threeScene: ThreeScene) {
    super(domElement, threeScene)
    this.particles = this.initPointsSystem()
  }

  private initPointsSystem() {
    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        this.positions[this.i] =
          ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2 // x
        this.positions[this.i + 1] = 0 // y
        this.positions[this.i + 2] =
          iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) / 2 // z

        this.scales[this.j] = 1

        this.i += 3
        this.j++
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    )
    geometry.setAttribute('scale', new THREE.BufferAttribute(this.scales, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) }
      },
      vertexShader: `
      attribute float scale;
          void main() {
              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
              gl_PointSize = scale * ( 300.0 / - mvPosition.z );
              gl_Position = projectionMatrix * mvPosition;
          }
    `,
      fragmentShader: `
      uniform vec3 color;
          void main() {
              if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
              gl_FragColor = vec4( color, 1.0 );
          }
      `
    })
    const points = new THREE.Points(geometry, material)
    console.log(points);
    points.layers.enable(1)
    this.threeScene.scene.add(points)
    return points
  }
  addEvent = (stop: boolean) => {
    
    if (stop) {
      // this.domElement.addEventListener('pointermove', this.onPointerMove)

    } else {
      // this.domElement.removeEventListener('pointermove', this.onPointerMove)
    }
    // this.isPlay()
    this.stop = stop
  }
  private onPointerMove = (event: PointerEvent) => {
    if (event.isPrimary === false) return
    this.mouseX = event.clientX - this.windowHalfX
    this.mouseY = event.clientY - this.windowHalfY
  }
  update = () => {
    this.cameraUpdate()
    this.pointsUpdate()
  }
  private isPlay = () => {
    if (!this.stop) {
      this.SEPARATION = 100
    } else {
      this.mouseX = 2000
      this.mouseY = 2000
    }
  }
  private cameraUpdate = () => {
    if (this.stop) return
    this.threeScene.camera.position.x +=
      (this.mouseX - this.threeScene.camera.position.x) * 0.05
    this.threeScene.camera.position.y +=
      (-this.mouseY - this.threeScene.camera.position.y) * 0.05
    this.threeScene.camera.position.z +=
      (-this.mouseY - this.threeScene.camera.position.y) * 0.05
    // this.threeScene.camera.lookAt(this.threeScene.scene.position)
    this.threeScene.controls.update()
  }
  private pointsUpdate = () => {
    // @ts-ignore
    const positions = this.particles.geometry.attributes.position.array
    // @ts-ignore
    const scales = this.particles.geometry.attributes.scale.array

    let i = 0,
      j = 0

    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        positions[i + 1] =
          Math.sin((ix + this.count) * 0.3) * 50 +
          Math.sin((iy + this.count) * 0.5) * 50

        scales[j] =
          (Math.sin((ix + this.count) * 0.3) + 1) * 20 +
          (Math.sin((iy + this.count) * 0.5) + 1) * 20

        i += 3
        j++
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true
    this.particles.geometry.attributes.scale.needsUpdate = true

    this.count += 0.1
  }
}
