import TWEEN from '@tweenjs/tween.js'
import ThreeScene from './ThreeScene'
import { Vector3 } from 'three'

interface needTime {
  controls: number
  camera: number
}

const positionSet = {
  homePosition: {
    controlsTarget: new Vector3(1, 0, 0),
    positionTarget: new Vector3(-2000, -2000, -2000),
    needTime: {
      camera: 1000 * 2,
      controls: 1000 * 2
    }
  },
  targetPosition: {
    controlsTarget: new Vector3(0, 0, 0),
    positionTarget: new Vector3(500, 3000, 0),
    needTime: {
      camera: 1000 * 1,
      controls: 1000 * 1
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
  initTween(
    controlsTarget: THREE.Vector3,
    positionTarget: THREE.Vector3,
    needTime: needTime
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
  flyTo = (propertyKey: keyof typeof positionSet) => {
    const tweens = this.initTween(
      positionSet[propertyKey].controlsTarget,
      positionSet[propertyKey].positionTarget,
      positionSet[propertyKey].needTime
    )
    this.play(tweens)
  }
}
