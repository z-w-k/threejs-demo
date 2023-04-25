// import { vertexShader, fragmentShader } from './shaders'
import Tween from './tween'
import * as THREE from 'three'

const DEG2RAD = Math.PI / 180


class Particle {
  position = new THREE.Vector3()
  velocity = new THREE.Vector3()
  acceleration = new THREE.Vector3()
  angle = 0
  angleVelocity = 0
  angleAcceleration = 0
  size = 16
  color = new THREE.Color()
  opacity = 1
  age = 0
  alive = 0
  sizeTween!:Tween
  colorTween!:Tween
  opacityTween!:Tween
  constructor() {}

  update(dt:number) {
    this.position.add(this.velocity.clone().multiplyScalar(dt))
    this.velocity.add(this.acceleration.clone().multiplyScalar(dt))
    this.angle += this.angleVelocity * DEG2RAD * dt
    this.angleVelocity += this.angleAcceleration * DEG2RAD * dt
    this.age += dt

    if (this.sizeTween.times.length > 0) {
      this.size = this.sizeTween.lerp(this.age) as number
    }

    if (this.colorTween.times.length > 0) {
      const colorHSL = this.colorTween.lerp(this.age) as THREE.Vector3
      this.color = new THREE.Color().setHSL(colorHSL.x, colorHSL.y, colorHSL.z)
    }

    if (this.opacityTween.times.length > 0) {
      this.opacity = this.opacityTween.lerp(this.age) as number
    }
  }
}

export default Particle
