import TWEEN, { Tween } from '@tweenjs/tween.js'
import ThreeScene from './ThreeScene'
import { Vector3 } from 'three'
import { flyToPosition } from '../store/mainStore'



export default class TweenJS {
  threeScene: ThreeScene
  tween
  constructor(threeScene: ThreeScene) {
    this.threeScene = threeScene
    this.tween = TWEEN
  }
  initTween(flyToPosition: flyToPosition) {
    const cam = this.threeScene.camera.position
    const con = this.threeScene.controls.target

    const { controlsTarget, positionTarget, needTime } = flyToPosition
    const cameraTween = new TWEEN.Tween(cam)
      .to(positionTarget, needTime.camera * 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)

    const controlsTween = new TWEEN.Tween(con)
      .to(controlsTarget, needTime.controls * 1000)
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
  flyTo = (propertyKey: flyToPosition) => {
    let tweens: Tween<Vector3>[]
    tweens = this.initTween(propertyKey)
    this.play(tweens!)
  }
}
