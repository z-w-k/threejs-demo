import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { Octree } from 'three/examples/jsm/math/Octree'
import Stats from 'three/examples/jsm/libs/stats.module'
export class ThreeBaseApi {
  domElement!: HTMLElement
  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  controls!: OrbitControls
  light!: THREE.Light
  stats!: Stats
  gui!: GUI
  worldOctree!: Octree
}
