import { Material, Mesh, Texture, Vector2 } from 'three'
import { MainStore, ScenePosition } from '../../store/mainStore'
import { MapParams, ModelParams, TemperatureData } from '../../util/temperature'
type ModelPositionParams = Parameters<ModelParams>
type MapParamsData = Parameters<MapParams>[0][]

export default defineComponent({
  setup() {
    const mainStore = MainStore()
    const route = useRoute()
    let box: ReturnType<ModelParams>
    let player: number
    const boxPlateDataReferer = [
      {
        canvasWeight: 100,
        canvasHeight: 20
      },
      {
        canvasWeight: 100,
        canvasHeight: 20
      },
      {
        canvasWeight: 100,
        canvasHeight: 80
      }
    ]
    const init = () => {
      const targetPosition: ModelPositionParams[1] = Object.values(
        mainStore.flyTo(route.name as keyof ScenePosition).controlsTarget
      ) as [number, number, number]
      box = mainStore.utilSet.temp!.createModel(
        [100, 20, 200],
        targetPosition,
        { color: 'white', map: true, transparent: true }
      )!

      const tempDataSet = createTempData()
      let i = 0
      player = setInterval(() => {
        if (i === 200) i = 0
        initTemp(tempDataSet[i], box)
        i++
      }, 1000 / 60)

      mainStore.utilSet.threeScene?.scene.add(box)
    }

    const createTempData = () => {
      const tempDataSet = []

      for (let i = 0; i < 200; i++) {
        tempDataSet.push(
          processData(mainStore.utilSet.temp!.createRandomData(i))
        )
      }

      return tempDataSet
    }

    const initTemp = (tempData: MapParamsData, rectBox: typeof box) => {
      tempData.forEach((temp, tempInd) => {
        const texture = mainStore.utilSet.temp?.createMap(temp)
        const material = rectBox.material as THREE.Material[]
        if (tempInd === 2) {
          texture!.rotation = -Math.PI / 2
          texture!.center.set(0.5, 0.5)
        }
        //@ts-ignore
        material[tempInd].map = texture
        //@ts-ignore
        material[tempInd].map.needsUpdate = true
        //   console.log(texture);
      })
    }

    onMounted(() => {
      init()
    })

    const processData = (tempDataRaw: number[][]): MapParamsData => {
      let boxPlateData = new Array()
      boxPlateDataReferer.forEach((referer, plateInd) => {
        boxPlateData[plateInd] = {}
        const plate = boxPlateData[plateInd]
        plate.temperaturePlate = new Array()
        plate.canvasWeight = referer.canvasWeight
        plate.canvasHeight = referer.canvasHeight
        const y = Math.floor(referer.canvasHeight / tempDataRaw.length)
        for (let i = 0; i < tempDataRaw.length; i++) {
          plate.temperaturePlate[i] = new Array()
          const x = Math.floor(referer.canvasWeight / tempDataRaw[i].length)
          for (let j = 0; j < tempDataRaw[i].length; j++) {
            plate.temperaturePlate[i][j] = {
              //居中(*/2)
              x: x * (j + 1) - x / 2,
              y: y * (i + 1) - y / 2,
              value: tempDataRaw[i][j]
            }
          }
        }
      })
      return boxPlateData!
    }

    const clearScene = () => {
      console.log('热力图已清除')
      clearInterval(player)
      box.geometry.dispose()
      box.material.forEach((m) => {
        m.dispose()
      })
      box.clear()
      mainStore.utilSet.threeScene?.scene.remove(box)
    }

    onBeforeUnmount(() => {
      setTimeout(clearScene, 500)
    })

    return {}
  },
  render() {
    return <div></div>
  }
})
