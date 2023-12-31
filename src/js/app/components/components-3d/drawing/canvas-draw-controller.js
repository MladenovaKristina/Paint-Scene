import { Black, MessageDispatcher } from "../../../../utils/black-engine.module";

export default class CanvasDrawController {
    constructor() {

        this.messageDispatcher = new MessageDispatcher();
        this.onDrawEvent = 'onDrawEvent';

        this.enabled = true;

        this._canvas = null;
        this._ctx = null;
        this._isLineBroken = false;

        this.color = '#00ff00';
        this._pointArray = [];
        this._lastToDraw = 0;
        this._prevToRedraw = 0;

        this._initCanvas();
        this.resetCanvas();
    }

    _initCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.style.position = "absolute";
        this._canvas.style.top = "0";
        this._canvas.style.left = "0";
        this._canvas.style.zIndex = "0";
        this._canvas.style.backgroundColor = "#ff00ff";

        this._canvas.id = "drawingCanvas";
        const currentDiv = document.getElementById("appContainer");
        document.body.insertBefore(this._canvas, currentDiv);

        this._ctx = this._canvas.getContext('2d');
    }

    resetCanvas() {
        this._canvas.width = 512;
        this._canvas.height = 512;

        this._canvas.style.left = (window.innerWidth / 2 - this._canvas.width / 2) + 'px';
        this._canvas.style.top = (window.innerHeight - this._canvas.height) - 50 + 'px';

        this._pointArray = [];
        this._prevToRedraw = 0;
    }

    onDown(x, y) {
        const realX = this._canvas.width / 2 + this._canvas.width * x;
        const realY = this._canvas.height / 2 + this._canvas.height * y;

        const pointData = new PointData(realX, realY, POINT_TYPES.START, this.color);
        this._pointArray.push(pointData);

        this._isLineBroken = false;

        this.onUpdate();
    }

    onMove(x, y) {
        if (this._isLineBroken) {
            this.onDown(x, y);
            return;
        }

        const realX = this._canvas.width / 2 + this._canvas.width * x;
        const realY = this._canvas.height / 2 + this._canvas.height * y;

        const pointData = new PointData(realX, realY, POINT_TYPES.PROGRESS, this.color);
        //?what this does

        const l = this._pointArray.length - 1;
        if (l < 0) {
            this.onDown(x, y);
            return;
        }

        const diffX = Math.abs(realX - this._pointArray[l].x);
        const diffY = Math.abs(realY - this._pointArray[l].y);

        if (diffX + diffY > 2)
            this._pointArray.push(pointData);

        this.onUpdate();
    }

    onUp() {
        this._isLineBroken = true;
    }

    _draw(dt) {
        for (let i = this._prevToRedraw; i < this._pointArray.length; i++) {
            const point = this._pointArray[i];

            this._prevToRedraw = i;

            this._ctx.shadowColor = point.color;
            this._ctx.shadowBlur = 10;

            if (point.type === POINT_TYPES.START) {
                this._ctx.fillStyle = point.color;
                this._ctx.beginPath();
                this._ctx.arc(point.x, point.y, point.width, 0, 2 * Math.PI);
                this._ctx.fill();
            }
            else if (point.type === POINT_TYPES.PROGRESS) {
                const prevPoint = this._pointArray[i - 1];

                this._ctx.lineWidth = point.width;
                this._ctx.lineCap = "round";
                this._ctx.strokeStyle = point.color;
                this._ctx.beginPath();
                this._ctx.moveTo(prevPoint.x, prevPoint.y);
                this._ctx.lineTo(point.x, point.y);
                this._ctx.stroke();
            }

            this._lastToDraw = i;
        }

        this.messageDispatcher.post(this.onDrawEvent, this._pointArray.length);
    }

    onUpdate(dt) {

        this._draw(dt);
    }
}

class PointData {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.drawn = false;

        this.width = 25;
    }
}

const POINT_TYPES = {
    START: 0,
    PROGRESS: 1
};