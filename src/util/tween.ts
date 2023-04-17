import TWEEN from '@tweenjs/tween.js'
import ThreeScene from './ThreeScene'
import { Vector3 } from 'three'

interface needTime {
  controls: number
  camera: number
}

export default class TweenJS {
  threeScene: ThreeScene
  tween
  constructor(threeScene: ThreeScene) {
    this.threeScene = threeScene
    this.tween = TWEEN
  }
  initTween(
    controlsTarget: THREE.Vector3,
    positionTarget: THREE.Vector3,
    needTime: needTime,
  ) {

    const cameraTween = new TWEEN.Tween(this.threeScene.camera.position)
      .to(positionTarget, needTime.camera)
      .easing(TWEEN.Easing.Quadratic.InOut)
    
    const controlsTween = new TWEEN.Tween(this.threeScene.controls.target)
      .to(controlsTarget, needTime.controls)
      .easing(TWEEN.Easing.Quadratic.InOut)

    const update = () => {
        
      this.threeScene.controls.update()
    }
    cameraTween.onUpdate(update)
    controlsTween.onUpdate(update)
    cameraTween.chain()
    controlsTween.chain()
    return [cameraTween, controlsTween]
  }
  play(tweens: any[]) {
    tweens.forEach((tween) => {
      tween.start()
    })
  }
}
