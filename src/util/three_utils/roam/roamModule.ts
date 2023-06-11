import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'
import * as THREE from 'three'
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export class FpsControls {
  playerCollider = new Capsule(
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(0, 1, 0),
    0.35
  )
  playerOnFloor = false
  GRAVITY = 30
  playerVelocity = new THREE.Vector3()
  playerDirection = new THREE.Vector3()
  keyStates: { [args: string]: any } = {}
  clock = new THREE.Clock()
  STEPS_PER_FRAME = 5

  constructor(
    public dom: HTMLElement,
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public gui: GUI,
    public commonGUI: GUI,
    public worldOctree: Octree
  ) {
    this.initFps()
  }
  initFps = () => {
    const helper = new OctreeHelper(this.worldOctree, new THREE.Color('red'))
    helper.visible = false
    this.scene.add(helper)

    this.commonGUI
      .add({ OctreeHelper: false }, 'OctreeHelper')
      .onChange(function (value: any) {
        helper.visible = value
      })
    document.addEventListener('keydown', (event) => {
      this.keyStates[event.code] = true
    })

    document.addEventListener('keyup', (event) => {
      this.keyStates[event.code] = false
    })
    // this.dom.addEventListener('mousedown', () => {
    //   document.body.requestPointerLock()
    // })
    document.body.addEventListener('mousemove', (event) => {
      if (document.pointerLockElement === document.body) {
        this.camera.rotation.y -= event.movementX / 500
        this.camera.rotation.x -= event.movementY / 500
        // const cd = new THREE.Vector3()
        // this.camera.getWorldDirection(cd)
        // console.log('player',this.playerDirection);
        // console.log('camera', cd)
      }
    })
  }
  updatePlayer(deltaTime: any) {
    let damping = Math.exp(-4 * deltaTime) - 1

    if (!this.playerOnFloor) {
      this.playerVelocity.y -= this.GRAVITY * deltaTime

      // small air resistance
      damping *= 0.1
    }

    this.playerVelocity.addScaledVector(this.playerVelocity, damping)

    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime)
    this.playerCollider.translate(deltaPosition)

    this.playerCollisions()

    this.camera.position.copy(this.playerCollider.end)
  }
  playerCollisions() {
    const worldOctree = this.worldOctree
    const playerCollider = this.playerCollider
    const result = worldOctree.capsuleIntersect(playerCollider)
    this.playerOnFloor = false

    if (result) {
      this.playerOnFloor = result.normal.y > 0

      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        )
      }

      playerCollider.translate(result.normal.multiplyScalar(result.depth))
    }
  }

  getForwardVector() {
    this.camera.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()

    return this.playerDirection
  }

  getSideVector() {
    this.camera.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()
    this.playerDirection.cross(this.camera.up)

    return this.playerDirection
  }

  playerControls(deltaTime: any) {
    // gives a bit of air control
    const speedDelta = deltaTime * (this.playerOnFloor ? 25 : 8)
    const keyStates = this.keyStates
    const playerVelocity = this.playerVelocity
    if (keyStates['KeyW']) {
      playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta))
    }

    if (keyStates['KeyS']) {
      playerVelocity.add(this.getForwardVector().multiplyScalar(-speedDelta))
    }

    if (keyStates['KeyA']) {
      playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta))
    }

    if (keyStates['KeyD']) {
      playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta))
    }

    if (this.playerOnFloor) {
      if (keyStates['Space']) {
        playerVelocity.y = 15
      }
    }
  }

  teleportPlayerIfOob() {
    const camera = this.camera
    const playerCollider = this.playerCollider
    if (camera.position.y <= -25) {
      playerCollider.start.set(0, 0.35, 0)
      playerCollider.end.set(0, 1, 0)
      playerCollider.radius = 0.35
      camera.position.copy(playerCollider.end)
      camera.rotation.set(0, 0, 0)
    }
  }

  animate = () => {
    const deltaTime =
      Math.min(0.05, this.clock.getDelta()) / this.STEPS_PER_FRAME

    // we look for collisions in substeps to mitigate the risk of
    // an object traversing another too quickly for detection.
    // this.controls.update()

    for (let i = 0; i < this.STEPS_PER_FRAME; i++) {
      this.playerControls(deltaTime)

      this.updatePlayer(deltaTime)

      this.teleportPlayerIfOob()
    }
  }
}
