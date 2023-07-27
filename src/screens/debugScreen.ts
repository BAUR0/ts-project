import * as PIXI from "pixi.js";
import Screen, { ScreenInitData } from "./screen";

interface DebugScreenInitData extends ScreenInitData {
    onDebug: Function
}

interface DebugData {
    tint: string,
    value: string,
    weights: number[],
    x: number,
    y: number
}

/**
 * Debug Screen
 *
 * @class DebugScreen
 * @extends Screen
 */
class DebugScreen extends Screen {

    private readonly _onDebug: Function;
    private readonly _debugData: DebugData[];
    private _buttons: PIXI.Graphics[];

	constructor(initData: DebugScreenInitData) {
        super(initData);

        const { onDebug } = initData;

        this._onDebug = onDebug;
        this._debugData = [
            { tint: "#bbffff", value: "5000", weights: [0], x: -900, y: -490 },
            { tint: "#bbffff", value: "2000", weights: [174], x: -900, y: -415 },
            { tint: "#bbffff", value: "1000", weights: [104, 284], x: -900, y: -340 },
            { tint: "#bbffff", value: "400", weights: [124, 304], x: -900, y: -265 },
            { tint: "#bbffff", value: "200", weights: [4, 184], x: -900, y: -190 },
            { tint: "#ffffff", value: "CLEAR", weights: [-1], x: -900, y: -115 }
        ];
        this._buttons = [];

        this._create();
        this._createListeners();
    }

	/**
	 * Create the debug screen
	 *
	 * @private
	 */
    _create() {
        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 25,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#000000'
		});

        this._debugData.forEach(({ tint, value, weights, x, y }, i) => {
            const gfx = new PIXI.Graphics();
            gfx.beginFill("#ff0000", 1);
            gfx.drawRoundedRect(x, y, 200, 50, 15);
            gfx.endFill();
            gfx.interactive = true;
            gfx.tint = tint;
            gfx.on('pointerdown', () => this._onClick(gfx, weights));
            this.screenContainer.addChild(gfx);

            this._buttons.push(gfx);

            const debugText = new PIXI.Text(`${value}`, style);
            debugText.name = `debugText${i}`;
            debugText.width = 100;
            debugText.position = { x: x + 50, y: y + 10 };
            gfx.addChild(debugText);
        });
    }

	/**
	 * Create the debug screen event listeners
     * Pressing D will toggle the debug screen on/off
	 *
	 * @private
	 */
    _createListeners() {
        window.addEventListener("keydown", (ev) => {
            switch (ev.code) {
                case "KeyD":
                    this.screenContainer.visible = !this.screenContainer.visible;
                    break;
                default:
                    break;
            }
        });
    }

	/**
	 * Choose a weight from the ones passed and send that to the bonus screen
	 *
	 * @private
     * @param {PIXI.Graphics} gfx - The instance of the graphic we have clicked
     * @param {Array.<number>} weights - The possible weights we want to force
	 */
    _onClick(gfx: PIXI.Graphics, weights: number[]) {
        this._buttons.forEach((b) => b.tint = "#bbffff");
        gfx.tint = "#ffffff"; // make our selected force stand out

        const weight = weights[this._randomIntBetween(0, weights.length)];
        this._onDebug(weight);
    }

    /**
     * Returns a random number between min and max, exclusive
     *
     * @param {number} min - minimum number
     * @param {number} max - maximum number (exclusive)
     * @returns {number}
     */
    _randomIntBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

export default DebugScreen;