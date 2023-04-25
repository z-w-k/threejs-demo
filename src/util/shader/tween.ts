import * as THREE from "three";

function getValues <T>(values:T):T{
    return values as T
}

class Tween {
  constructor(public times:number[]=[],public values: THREE.Vector3[] | number[] = []) {
    this.times = times || []
    this.values = getValues(values)
  }

  lerp(t:number){
    if(this.times.length == 0) return
    let i = 0, n = this.times.length
    while(i < n && t > this.times[i]) i++
    if(i == 0) return this.values[0]
    if(i == n) return this.values[n-1]
    const ratio = (t - this.times[i-1]) / (this.times[i] - this.times[i-1])
    if(this.values[0] instanceof THREE.Vector3) {
      const values = this.values as THREE.Vector3[]
      return (values[i-1]).clone().lerp(values[i], ratio)
    } else {
      const values= this.values as number[]
      return values[i-1] + ratio * (values[i] - (values[i-1]))
    }
    
  }

}

export default Tween