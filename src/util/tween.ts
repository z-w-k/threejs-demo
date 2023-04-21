import TWEEN, { Tween } from '@tweenjs/tween.js'
import ThreeScene from './ThreeScene'
import { Vector3 } from 'three'

export interface flyToPosition {
  controlsTarget: Vector3
  positionTarget: Vector3
  needTime: {
    camera: number
    controls: number
  }
}

const positionSet = {
  homePosition: {
    controlsTarget: new Vector3(1, 0, 0),
    positionTarget: new Vector3(-2000, -2000, -2000),
    needTime: {
      camera:2,
      controls:2
    }
  },
  targetPosition: {
    controlsTarget: new Vector3(0, 0, 0),
    positionTarget: new Vector3(500, 3000, 0),
    needTime: {
      camera: 1,
      controls: 1
    }
  }
}

export default class TweenJS {
  threeScene: ThreeScene
  tween
  constructor(threeScene: ThreeScene) {
    this.threeScene = threeScene
    this.tween = TWEEN
  }
  initTween(flyToPosition: flyToPosition) {
    const { controlsTarget, positionTarget, needTime } = flyToPosition
    const cameraTween = new TWEEN.Tween(this.threeScene.camera.position)
      .to(positionTarget, needTime.camera *1000)
      .easing(TWEEN.Easing.Quadratic.InOut)

    const controlsTween = new TWEEN.Tween(this.threeScene.controls.target)
      .to(controlsTarget, needTime.controls*1000)
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
  flyTo = (
    propertyKey:typeof positionSet.homePosition | keyof typeof positionSet
  ) => {

    let tweens: Tween<Vector3>[]
    if (typeof propertyKey === 'string') {
      tweens = this.initTween(positionSet[propertyKey])
    } else {
      tweens = this.initTween(propertyKey)
    }
    this.play(tweens!)
  }
}
