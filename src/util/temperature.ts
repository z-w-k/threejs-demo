import * as THREE from 'three'
import ThreeScene from './ThreeScene'
// @params config = {
//     position: [0, 0, 0],
//     size: [10, 10, 10],
//   };
// let points = 0;

export interface TemperatureData {
  x: number
  y: number
  value: number
}

export interface ModelParams {
  (
    size: number[],
    position: [number, number, number],
    materialConfig?: {
      color?: string
      map?: boolean
      transparent?: boolean
    },
    face?: number
  ): THREE.Mesh<THREE.BoxGeometry,THREE.Material[]>
}

export interface MapParams {
  (option: {
    canvasWeight: number
    canvasHeight: number
    temperaturePlate: TemperatureData[][] | TemperatureData[]
    multiply?: number
    opacity?: number
  }): THREE.Texture
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

  //模拟温度数据
  createRandomData(
    xNum: number = 10,
    yNum: number = 2,
    maxTemp: number = 100,
    minTemp: number = 10
  ) {
    const rawData = []
    for (let i = 0; i < yNum; i++) {
      const row = []
      for (let j = 0; j < xNum; j++) {
        row.push(Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp)
      }
      rawData.push(row)
    }
    return rawData
  }
  //创建模型
  createModel: ModelParams = function (
    size = [5, 5, 5],
    position = [0, 0, 0],
    materialConfig = { color: 'pink' },
    face = 6
  ) {
    // const colorSet = ['red','orange','yellow','blue','green','purple']

    const geometry = new THREE.BoxGeometry(...size)
    const mats = []
    for (let i = 0; i < face; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: materialConfig.color as THREE.ColorRepresentation,
        map: materialConfig.map ? new THREE.Texture() : null,
        transparent: materialConfig.transparent ? true : false
      })
      mats.push(material)
    }

    const box = new THREE.Mesh(geometry, mats)
    box.position.set(...position)
    return box
  }
  //接收温度场模型
  createMap: MapParams = (option) => {
    const {
      canvasWeight,
      canvasHeight,
      temperaturePlate,
      multiply,
      opacity
    } = option
    this.temperaturePlate = temperaturePlate
    this.canvasWeight = canvasWeight
    this.canvasHeight = canvasHeight
    this.multiply = multiply ? multiply : 1
    this.opacity = opacity ? opacity :1
    const heatMapTexture = new THREE.Texture(this.heatMap())
    return heatMapTexture
  }

  readyDraw(drawData: TemperatureData) {
    this.drawCircular({
      x: drawData.x,
      y: drawData.y,
      radius: Math.floor(drawData.value)/3,
      weight: Math.floor(drawData.value)/150,
    })
  }

  heatMap() {
    this.points = this.temperaturePlate.length
    const canvas = document.createElement('canvas')
    canvas.width = this.canvasWeight
    canvas.height = this.canvasHeight
    this.context = canvas.getContext('2d')!
    this.context.fillStyle = "RGBA(255,231,0,.2)";
    this.context.fillRect(0, 0, this.canvasWeight, this.canvasHeight);
    for (let i = 0; i < this.points; i++) {
      if (this.temperaturePlate[i] instanceof Array) {
        for (let j = 0; j < this.temperaturePlate[i].length; j++) {
          this.readyDraw(this.temperaturePlate[i][j])
        }
      } else {
        this.readyDraw(this.temperaturePlate[i])
      }
    }
    let palette = this.createPalette();
    // document.body.appendChild(palette.canvas);
    let imageData = this.context.getImageData(0, 0, this.canvasWeight, this.canvasHeight);
    let pictureData = imageData.data;
    for (let i = 3; i < pictureData.length; i += 4) {
      //根据画面数据绘制颜色
      let alpha = pictureData[i];
      let color = palette.pickColor(alpha);
      pictureData[i - 3] = color[0];
      pictureData[i - 2] = color[1];
      pictureData[i - 1] = color[2];
    }
    // for (var i = 0; i < pictureData.length; i += 4) {
    //   // 背景设置成青色
    //   if (pictureData[i + 3] == 0) {
    //     pictureData[i] = 50;
    //     pictureData[i + 1] = 228;
    //     pictureData[i + 2] = 50;
    //     pictureData[i + 3] = 0.5;
    //   }
    // }
    this.context.putImageData(imageData, 0, 0); //设置画面数据

    return canvas
  }

  //绘制辐射圆
  drawCircular(opts: { [arg: string]: number }) {
    let { x, y, radius, weight } = opts
    // 创建圆设置填充色
    let rGradient = this.context.createRadialGradient(x, y, 0, x, y, radius)
    rGradient.addColorStop(0, `rgba(255 0, 0, ${weight})`)
    rGradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
    this.context.fillStyle = rGradient
    // 设置globalAlpha
    //倍率必须根据最高温度值
    this.context.globalAlpha = 1
    this.context.beginPath()
    this.context.arc(x, y, radius, 0, 2 * Math.PI)
    this.context.closePath()

    this.context.fill() // 填充
  }

  createPalette() {
    //颜色条的颜色分布
    const colorStops = {
      '0': '#ffe700',
      '0.5': '#ffc000',
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
