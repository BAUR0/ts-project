import * as PIXI from "pixi.js";
import Tween from "../lib/tween";
import Screen, { ScreenInitData } from "./screen";

/**
 * Title Screen
 *
 * @class TitleScreen
 * @extends Screen
 */
class TitleScreen extends Screen {

    private _resolver?: Function;
    private _titleButton: PIXI.Sprite;

	constructor(initData: ScreenInitData) {
        super(initData);

        this._resolver = undefined;
        this._titleButton = this._createButton();

        this._disable();
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
            
            this.screenContainer.alpha = 0;
            this.screenContainer.visible = true;
            await this._fadeInTween.start();
            this._enable();
        });
    }

	/**
	 * Create the title screen button
	 *
	 * @private
	 * @returns {PIXI.Sprite}
	 */
    _createButton() {
        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontWeight: 'bold',
			fill: '#ffffff'
		});

        const titleText = new PIXI.Text(`TypeScript Project`, style);
		titleText.name = 'titleText';
		titleText.position = { x: -155, y: -180 };
		this.screenContainer.addChild(titleText);

		const titleButton = PIXI.Sprite.from(PIXI.Assets.get('play'));
		titleButton.name = 'titleButton';
		titleButton.position = { x: -122, y: -123 };
		titleButton.on('pointerdown', () => this._onClick());
		this.screenContainer.addChild(titleButton);

        return titleButton;
    }

    /**
     * Enables the title button
     *
     * @private
     */
    _enable() {
		this._titleButton.interactive = true;
		this._titleButton.alpha = 1;
    }

    /**
     * Disables the title button
     *
     * @private
     */
    _disable() {
		this._titleButton.interactive = false;
		this._titleButton.alpha = 0.5;
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
        await this._fadeOutTween.start();
        this.screenContainer.visible = false;

        if (this._resolver) {
            this._resolver();
            this._resolver = undefined;
        }
    }
}

export default TitleScreen;