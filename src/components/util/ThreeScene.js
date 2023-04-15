import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
class ThreeScene {
  constructor() {}
  init(domElement, cameraConfig  = { fov: 60, near: 0.1, far: 100 }) {
    this.domElement = domElement;
    this.cameraConfig = cameraConfig;
    this.initScene();
    this.initRenderer();
    this.initControls();
    this.initLight();
    this.loadingManager =  new THREE.LoadingManager();
  }
  initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");
    this.scene = scene;
  }
  initCamera() {
    new THREE.PerspectiveCamera();
    const camera = new THREE.PerspectiveCamera(
      this.cameraConfig.fov,
      this.domElement.clientWidth / this.domElement.clientHeight,
      this.cameraConfig.near,
      this.cameraConfig.far
    );
    this.scene.add(camera);
    this.camera = camera;
  }
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: "highp",
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(this.domElement.clientWidth, this.domElement.clientHeight);
    this.domElement.appendChild(renderer.domElement);
    this.renderer = renderer;
  }
  initControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true; // 手动操作更顺滑
    controls.update();
    controls.enabled = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.minDistance = 40;
    controls.maxDistance = 80;
    this.controls = controls;
  }
  initLight() {
    // 环境光
    const AmbientLight = new THREE.AmbientLight("#fff", 3);
    this.scene.add(AmbientLight);
    this.AmbientLight = AmbientLight;
  }
    loadModel() {
     return new GLTFLoader(this.loadingManager);
  }
}

export default ThreeScene;
