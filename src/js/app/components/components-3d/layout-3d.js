import * as THREE from "three";
import Helpers from "../../helpers/helpers";
import CanvasDrawController from "./drawing/canvas-draw-controller";
import DrawController from "./drawing/draw-controller";
import Cube from "./cube";
export default class Layout3d extends THREE.Object3D {
    constructor(camera) {
        super();
        this._camera = camera;
        this._init();
        this._updatePositions();
        this._updateTransform();
    }

    onResize() {
        this._updatePositions();
        this._updateTransform();
    }

    _updateTransform() {
        if (Helpers.LP(false, true)) {

        }
        else {
        }
    }

    _updatePositions() {


    }

    _init() {
        this._initBox();
        this._initSpray();
        this._initCanvasDrawController()
        this._initPlane();

        this._initDrawController()
    }
    _initBox() {

        this._cube = new Cube();

        this.add(this._cube)
    }
    updateCanvasTexture(canvasTexture) {
        this._cube.material.map = canvasTexture;
    }

    _initPlane() {
        const canvasDOM = document.getElementById('drawingCanvas');
        this._canvasTexture = new THREE.CanvasTexture(canvasDOM);
        this._canvasTexture.flipY = false;
        console.log(document.getElementById('drawingCanvas'))
        this._cube.updateCanvasTexture(this._canvasTexture);
    }

    _initCanvasDrawController() {
        this._canvasDrawController = new CanvasDrawController();

        this._canvasDrawController.messageDispatcher.on(this._canvasDrawController.onDrawEvent, msg => {
            this._canvasTexture.needsUpdate = true;
        });

        this._canvasDrawController.color = '#ff0000';
    }
    _initDrawController() {
        const material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0
        });

        const geom = new THREE.PlaneGeometry(0.4, 0.6);
        const plane = new THREE.Mesh(geom, material);
        plane.position.set(0, 0.1, 0.1);
        this.add(plane);

        this._drawController = new DrawController(this._camera, plane, this._canvasDrawController, this._spray);
    }


    _initSpray() {
        this.width = -0.1;
        const geom = new THREE.BoxGeometry(this.width, this.width * 3, this.width, 10, 10, 10)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        this._spray = new THREE.Mesh(geom, material)
        this._spray.position.set(0, 0, 0.5)
        this._spray.rotation.set(0, 0, 0)

        this.add(this._spray)
    }

    onDown(x, y) {

        this._drawController.onDown(x, y);
    }

    onMove(x, y) {

        const mouse = new THREE.Vector2();

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        this._spray.position.x = mouse.x;
        this._spray.position.y = mouse.y - this.width;

        this._drawController.onMove(x, y);
    }

    onUp() {

        this._drawController.onUp();

    }




}
