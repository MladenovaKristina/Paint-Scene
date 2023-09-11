import * as THREE from "three";

export default class Cube extends THREE.Object3D {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this._initBox();
    }

    _initBox() {
        const geom = new THREE.BoxGeometry(0.5, 0.5, 0.5, 10, 10, 10)
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.7,
            side: THREE.DoubleSide,
            map: THREE.Cache.get('palet_buffet')
        })
        console.log(THREE.Cache.get('palet_buffet'))

        this._cube = new THREE.Mesh(geom, material)
        this._cube.position.set(0, 0, 0);
        this._cube.rotation.set(0, 0, 0);
        this.add(this._cube)
    }

    updateCanvasTexture(canvasTexture) {
        console.log(canvasTexture)
        this._cube.material.map = canvasTexture;
    }

}
