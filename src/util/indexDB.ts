import { API } from '../api/api'

export interface ModelInfo {
  dbName: string
  dbVer: number
  stores: DataInfo[]
}
export interface DataInfo {
  url: string
  data: Blob | null
}

export class InitIndexDB {
  connect: IDBOpenDBRequest
  _storeState: 'new' | 'old' | 'pending' = 'pending'
  _regCallback!: Array<() => void>
  db!: IDBDatabase
  constructor(
    public info: ModelInfo,
    public loadModel: (modelSet: DataInfo[]) => Promise<void>
  ) {
    if (!window.indexedDB) {
      console.log('您的浏览器不支持IndexedDB')
    }
    this.connect = window.indexedDB.open(info.dbName, info.dbVer)
    this.connect.onupgradeneeded = (event: any) => {
      console.log('数据库更新', event)
      this._storeState = 'new'
      const db = (this.db = event.target!.result as IDBDatabase)
      // console.log('【2】新建或者升级数据库 onupgradeneeded --- ', db)
      for (const store of info.stores) {
        if (db.objectStoreNames.contains(store.url)) {
          // 已经有仓库，验证一下是否需要删除原来的仓库
          // if (store.isClear) {
          // 删除原对象仓库，没有保存数据
          db.deleteObjectStore(store.url)
          // 建立新对象仓库
        }
        console.log('新建仓库')
        const DBstore = db.createObjectStore(store.url, {
          keyPath: 'id',
          autoIncrement: true
        })
        for (let key in store) {
          DBstore.createIndex(key, key, {
            // 是否唯一
            unique: false
          })
        }
      }
    }
    this.connect.onsuccess = async (event: any) => {
      this.db = event.target!.result as IDBDatabase
      console.log('数据库打开成功')
      if (this._storeState === 'new') {
        for (let store of this.info.stores) {
          store.data = await (await API.loadModel(store.url)).data
          this.addData(store.url, store, (result) => {})
        }
      }
      this.info.stores.forEach((store) => {
        this.find(store.url, (result) => {
          this.loadModel(result)
        })
      })
      if (this._storeState === 'pending') {
        this._storeState = 'old'
      }
    }
    this.connect.onerror = (event: any) => {
      console.log('打开数据库出错：', event.target!.error)
    }
  }

  addData = (
    storeName: string,
    data: DataInfo,
    callBack: (result: string) => void
  ) => {
    let store = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
    let request = store.add(data)
    request.onerror = function () {
      console.error('数据库中已有该数据')
    }
    request.onsuccess = function () {
      console.log(`${storeName} 下 ${data.url} 插入成功`)
      callBack(storeName)
    }
  }
  find = (storeName: string, callBack: (result: [any]) => void) => {
    console.log(this.db)

    let store = this.db
      .transaction(storeName, 'readwrite')
      .objectStore(storeName)
    let request = store.getAll()
    request.onerror = function () {
      console.error('getDataByKey error')
    }
    request.onsuccess = function (e: any) {
      let result = e.target.result
      if (result) {
        console.log('执行缓存加载')
        callBack(result)
      } else {
        console.log('没查到')
      }
    }
  }
}
