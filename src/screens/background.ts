import * as PIXI from "pixi.js";

interface BackgroundInitData {
    layer: PIXI.Container
}

/**
 * Background for the whole game
 *
 * @class Background
 */
class Background {

    private _layer: PIXI.Container;

	constructor(initData: BackgroundInitData) {
        const { layer } = initData;

        this._layer = layer;

        this._create();
    }

	/**
	 * Create the background
	 *
	 * @private
	 */
    _create() {
		const background = PIXI.Sprite.from(PIXI.Assets.get('bg'));
		background.name = 'background';
		background.zIndex = 1;
        background.position.set(-960, -540);
        background.scale.set(1.5, 1.5); // graphic provided is slightly smaller than our renderer size, stretch to fit
		this._layer.addChild(background);
    }
}

export default Background;