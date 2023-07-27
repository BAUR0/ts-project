import * as PIXI from "pixi.js";
import Tween from "../lib/tween";

export interface ScreenInitData {
    name: string,
    layer: PIXI.Container
}

/**
 * Screen
 *
 * @class Screen
 */
class Screen {
    
    private readonly _name: string;
    private _screenContainer: PIXI.Container;
    protected readonly _layer: PIXI.Container;
    protected _fadeInTween: Tween;
    protected _fadeOutTween: Tween;

	constructor(initData: ScreenInitData) {
        const { name, layer } = initData;

        this._name = name;
        this._layer = layer;

        this._screenContainer = this._createScreen();

        this._fadeInTween = new Tween(this.screenContainer, { alpha: 0 }, { alpha: 1 });
        this._fadeOutTween = new Tween(this.screenContainer, { alpha: 1 }, { alpha: 0 });
    }

	/**
	 * The container for the screen
	 *
	 * @readonly
	 * @member {PIXI.Container}
	 */
	get screenContainer() {
		return this._screenContainer;
	}

	/**
	 * Create the screen
	 *
	 * @private
	 * @returns {PIXI.Container}
	 */
    _createScreen() {
		const screenContainer = new PIXI.Container();
		screenContainer.name = this._name;
        screenContainer.visible = false;
        screenContainer.alpha = 0;
		this._layer.addChild(screenContainer);

        return screenContainer
    }
}

export default Screen;
