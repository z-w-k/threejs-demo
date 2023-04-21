import * as THREE from 'three'
import ThreeScene from './ThreeScene'
// @params config = {
//     position: [0, 0, 0],
//     size: [10, 10, 10],
//   };
// let points = 0;

interface TemperatureData {
  x: number
  y: number
  value: number
}
class TemperatureField {
  points: number = 0
  canvasHeight: number = 1000
  canvasWeight: number = 125
  multiply: number = 1
  opacity: number = 1
  temperaturePlate!: TemperatureData[][] | TemperatureData[] | any
  context!: CanvasRenderingContext2D
  constructor(public threeScene: ThreeScene) {}
  //创建模型
  createModel(
    size: number[] = [5, 5, 5],
    position: [number, number, number] = [0, 0, 0],
    materialConfig = { color: 'pink', map: false, transparent: false }
  ) {
    // const colorSet = ['red','orange','yellow','blue','green','purple']
    const geometry = new THREE.BoxGeometry(...size)
    const mats = []
    for (let i = 0; i < geometry.groups.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        // color: colorSet[i],
        map: materialConfig.map ? new THREE.Texture() : null,
        transparent: materialConfig.transparent
      })
      mats.push(material)
    }
    const box = new THREE.Mesh(geometry, mats)
    box.position.set(...position)
    return box
  }
  //接收温度场模型
  createMap(
    temperaturePlate: TemperatureData[][] | TemperatureData[],
    canvasWeight: number,
    canvasHeight: number,
    multiply: number,
    opacity: number
  ) {
    this.temperaturePlate = temperaturePlate
    this.canvasWeight = canvasWeight
    this.canvasHeight = canvasHeight
    this.multiply = multiply
    this.opacity = opacity
    const heatMapTexture = new THREE.Texture(this.heatMap())
    return heatMapTexture
  }

  readyDraw(drawData: TemperatureData) {
    this.drawCircular({
      x: drawData.x,
      y: drawData.y,
      radius: Math.floor(drawData.value / this.multiply),
      weight: Math.floor(drawData.value) / 1400,
      opacity: this.opacity
    })
  }

  heatMap() {
    this.points = this.temperaturePlate.length
    const canvas = document.createElement('canvas')
    canvas.width = this.canvasWeight
    canvas.height = this.canvasHeight
    this.context = canvas.getContext('2d')!
    // context.fillStyle = "RGBA(255,255,0,.5)";
    // context.fillRect(0, 0, width, height);
    for (let i = 0; i < this.points; i++) {
      if (this.temperaturePlate[i] instanceof Array) {
        for (let j = 0; j < this.temperaturePlate[i].length; j++) {
          this.readyDraw(this.temperaturePlate[i][j])
        }
      } else {
        this.readyDraw(this.temperaturePlate[i])
      }
    }
    // let palette = this.createPalette();
    // // document.body.appendChild(palette.canvas);
    // let imageData = context.getImageData(0, 0, width, height);
    // let pictureData = imageData.data;
    // for (let i = 3; i < pictureData.length; i += 4) {
    //   //根据画面数据绘制颜色
    //   let alpha = pictureData[i];
    //   let color = palette.pickColor(alpha);
    //   pictureData[i - 3] = color[0];
    //   pictureData[i - 2] = color[1];
    //   pictureData[i - 1] = color[2];
    // }

    // for (var i = 0; i < pictureData.length; i += 4) {
    //   // 背景设置成青色
    //   if (pictureData[i + 3] == 0) {
    //     pictureData[i] = 50;
    //     pictureData[i + 1] = 228;
    //     pictureData[i + 2] = 50;
    //     pictureData[i + 3] = 0.8;
    //   }
    // }
    // context.putImageData(imageData, 0, 0); //设置画面数据

    return canvas
  }

  //绘制辐射圆
  drawCircular(opts:{[arg:string]:number}) {
    let { x, y, radius, weight, opacity } = opts
    // 创建圆设置填充色
    let rGradient = this.context.createRadialGradient(x, y, 0, x, y, radius)
    rGradient.addColorStop(0, `rgba(255 0, 0, ${weight})`)
    rGradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
    this.context.fillStyle = rGradient
    // 设置globalAlpha
    //倍率必须根据最高温度值
    this.context.globalAlpha = weight / opacity
    this.context.beginPath()
    this.context.arc(x, y, radius, 0, 2 * Math.PI)
    this.context.closePath()

    this.context.fill() // 填充
  }

  createPalette() {
    //颜色条的颜色分布
    const colorStops = {
      '0': '#0f0',
      '0.5': '#ff0',
      '1': '#f00'
    }
    //颜色条的大小
    const width = 256,
      height = 5
    // 创建canvas
    const paletteCanvas = document.createElement('canvas')
    paletteCanvas.width = width
    paletteCanvas.height = height
    const ctx = paletteCanvas.getContext('2d')!

    // 创建线性渐变色
    const linearGradient = ctx.createLinearGradient(0, 0, width, 0)
    for (const key in colorStops) {
      linearGradient.addColorStop(
        Number(key),
        colorStops[key as keyof typeof colorStops]
      )
    }

    // 绘制渐变色条
    ctx.fillStyle = linearGradient
    ctx.fillRect(0, 0, width, height)

    let imageData = ctx.getImageData(0, 0, width, height).data // 读取像素值

    return {
      canvas: paletteCanvas,
      pickColor: function (position: number) {
        return imageData.slice(position * 4, position * 4 + 3)
      }
    }
  }
}

export default TemperatureField
