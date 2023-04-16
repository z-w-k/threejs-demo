import * as THREE from 'three'
abstract class Attrs<T> {
  abstract particles: THREE.Points
  protected SEPARATION: number = 100
  protected AMOUNTX: number = 50
  protected AMOUNTY: number = 50
  protected numParticles: number = this.AMOUNTX * this.AMOUNTY
  protected positions: Float32Array = new Float32Array(this.numParticles * 3)
  protected scales: Float32Array = new Float32Array(this.numParticles)
  protected count: number = 0
  protected i: number = 0
  protected j: number = 0
  protected mouseX: number = 0
  protected mouseY: number = 0
  protected windowHalfX: number
  protected windowHalfY: number
  constructor(protected domElement: HTMLElement, protected threeScene: T) {
    this.windowHalfX = domElement.clientWidth
    this.windowHalfY = domElement.clientHeight
  }
}

interface threeScene {
  [propName: string]: any
}

export default class HomePoints<T extends threeScene> extends Attrs<T> {
  particles: THREE.Points
  constructor(domElement: HTMLElement, threeScene: T) {
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
      new THREE.BufferAttribute(this.positions, 3),
    )
    geometry.setAttribute('scale', new THREE.BufferAttribute(this.scales, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
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
      `,
    })
    const points = new THREE.Points(geometry, material)
    this.threeScene.scene.add(points)
    return points
  }
  addEvent = (stop?: boolean) => {
    if (!stop) {
      return this.domElement.addEventListener('pointermove', this.onPointerMove)
    } else {
      this.domElement.removeEventListener('pointermove', this.onPointerMove)
    }
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

  private cameraUpdate = () => {
    this.threeScene.camera.position.x +=
      (this.mouseX - this.threeScene.camera.position.x) * 0.05
    this.threeScene.camera.position.y +=
      (-this.mouseY - this.threeScene.camera.position.y) * 0.05
    this.threeScene.camera.lookAt(this.threeScene.scene.position)
    this.threeScene.controls.update()
  }
  private pointsUpdate = () => {
    const positions = this.particles.geometry.attributes.position.array
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
