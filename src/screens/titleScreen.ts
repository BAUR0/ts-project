import * as PIXI from "pixi.js";
import Tween from "../lib/tween";

interface TitleScreenInitData {
    layer: PIXI.Container
}

/**
 * Title Screen
 *
 * @class TitleScreen
 */
class TitleScreen {

    private readonly _layer: PIXI.Container;
    private _resolver?: Function;
    private _titleScreen?: PIXI.Container;
    private _titleButton?: PIXI.Sprite;
    private _fadeInTween?: Tween;
    private _fadeOutTween?: Tween;

	constructor(initData: TitleScreenInitData) {
        const { layer } = initData;

        this._layer = layer;

        this._create();
    }

    /**
     * Enable the title screen and wait for a click
     *
     * @returns {Promise}
     */
    start() {
        return new Promise(async resolve => {
            this._resolver = resolve;

            console.log(`Title Screen Started`);
            
            this._titleScreen!.alpha = 0;
            this._titleScreen!.visible = true;
            await this._fadeInTween!.start();
            this._enable();
        });
    }

	/**
	 * Create the title screen
	 *
	 * @private
	 */
    _create() {
		this._titleScreen = new PIXI.Container();
		this._titleScreen.name = 'titleScreen';
        this._titleScreen.visible = false;
		this._layer.addChild(this._titleScreen);

        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontWeight: 'bold',
			fill: '#ffffff'
		});

        const titleText = new PIXI.Text(`TypeScript Project`, style);
		titleText.name = 'titleText';
		titleText.position = { x: -155, y: -180 };
		this._titleScreen.addChild(titleText);

		this._titleButton = PIXI.Sprite.from(PIXI.Assets.get('play'));
		this._titleButton.name = 'titleButton';
		this._titleButton.position = { x: -122, y: -123 };
		this._titleButton.on('pointerdown', () => this._onClick());
		this._titleScreen.addChild(this._titleButton);

        this._fadeInTween = new Tween(this._titleScreen, { alpha: 0 }, { alpha: 1 });
        this._fadeOutTween = new Tween(this._titleScreen, { alpha: 1 }, { alpha: 0 });

        this._disable();
    }

    /**
     * Enables the title button
     *
     * @private
     */
    _enable() {
		this._titleButton!.interactive = true;
		this._titleButton!.alpha = 1;
    }

    /**
     * Disables the title button
     *
     * @private
     */
    _disable() {
		this._titleButton!.interactive = false;
		this._titleButton!.alpha = 0.5;
    }

    /**
     * Play the outro tween and resolve the promise when title screen ends
     *
     * @async
     * @private
     */
    async _onClick() {
        console.log(`Title Screen Ended`);

        this._disable();
        await this._fadeOutTween!.start();
        this._titleScreen!.visible = false;

        if (this._resolver) {
            this._resolver();
            this._resolver = undefined;
        }
    }
}

export default TitleScreen;