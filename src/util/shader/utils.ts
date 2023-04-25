import * as THREE from "three";

export default {
  randomValue(min:number, max:number) {
    return min + max * (Math.random() - 0.5)
  },
  randomVector3(min:THREE.Vector3, max:THREE.Vector3) {
    const rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
	  return new THREE.Vector3().addVectors(min, new THREE.Vector3().multiplyVectors(max, rand3))
  }
}