import * as PIXI from "pixi.js";
import Tween from "../lib/tween";
import { soundPlayer } from "../game";
import Screen, { ScreenInitData } from "./screen";

/**
 * @typedef {object} BonusScreen_ResultData
 * @property {number} angle - The angle the wheel needs to finish on
 * @property {number} credits - The number of credits won
 */

interface BonusScreenInitData extends ScreenInitData {
    onWin: Function
}

interface WheelData {
    angle: number,
    credits: number,
    tint: string,
    weight: number,
}

interface BonusResult {
    angle: number,
    credits: number
}

/**
 * Bonus Screen
 *
 * @class BonusScreen
 * @extends Screen
 */
class BonusScreen extends Screen {

    private readonly _onWin: Function;
    private readonly _wheelData: WheelData[];
    private _forceWeight: number;
    private _resolver?: Function;
    private _bonusText: PIXI.Text;
    private _wheelContainer: PIXI.Container;
    private _wheelCenter: PIXI.Sprite;

	constructor(initData: BonusScreenInitData) {
        super(initData);

        const { onWin } = initData;

        this._onWin = onWin;
        this._resolver = undefined;
        this._wheelData = [
            { credits: 5000, weight: 4, angle: 0, tint: "#ff0000" },
            { credits: 200, weight: 100, angle: 45, tint: "#00ff00" },
            { credits: 1000, weight: 20, angle: 90, tint: "#0000ff" },
            { credits: 400, weight: 50, angle: 135, tint: "#ffff00" },
            { credits: 2000, weight: 10, angle: 180, tint: "#00ffff" },
            { credits: 200, weight: 100, angle: 225, tint: "#00ff00" },
            { credits: 1000, weight: 20, angle: 270, tint: "#0000ff" },
            { credits: 400, weight: 50, angle: 315, tint: "#ffff00" }
        ];
        this._forceWeight = -1;

        this._wheelContainer = this._createWheelContainer();
        this._wheelCenter = this._createWheelCenter();
        this._bonusText = this._createText();
        this._createWheelPin();

        this._disable();
    }
    
    /**
     * Force a specific weight
     *
     * @member {number}
     * @param {number} weight - the weight for the wheel result
     */
    set forceWeight(weight: number) {
        console.log(`Bonus Wheel Force Weight set to ${weight}`);
        this._forceWeight = weight;
    }

    /**
     * Enable the bonus screen, wait for a click, spin wheel and display result
     *
     * @returns {Promise}
     */
    start() {
        return new Promise(async resolve => {
            this._resolver = resolve;

            console.log(`Bonus Screen Started`);
            
            this._bonusText.visible = true;
            this._wheelContainer.angle = 0;
            this.screenContainer.alpha = 0;
            this.screenContainer.visible = true;
            await this._fadeInTween.start();

            this._enable();
        });
    }

	/**
	 * Create the bonus screen text
	 *
	 * @private
	 * @returns {PIXI.Text}
	 */
    _createText() {
        const style = new PIXI.TextStyle({
            align: "center",
			fontFamily: 'Arial',
			fontSize: 36,
			fontWeight: 'bold',
			fill: '#ff0000',
            stroke: "#000000",
            strokeThickness: 3
		});

        const bonusText = new PIXI.Text(`PRESS\nTO SPIN`, style);
		bonusText.name = 'bonusText';
        bonusText.width = 150;
		bonusText.position = { x: -75, y: -40 };
		this.screenContainer.addChild(bonusText);

        return bonusText;
    }

	/**
	 * Create the bonus screen wheel container and sections
	 *
	 * @private
	 * @returns {PIXI.Container}
	 */
    _createWheelContainer() {
		const wheelContainer = new PIXI.Container();
		wheelContainer.name = 'wheelContainer';
		this.screenContainer.addChild(wheelContainer);

        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#000000'
		});

        this._wheelData.forEach(({ angle, credits, tint, weight }, i) => {
            const wheelSection = PIXI.Sprite.from(PIXI.Assets.get('wheelSlice'));
            wheelSection.name = `wheelSection${i}`;
            wheelSection.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 1);
            wheelSection.angle = angle;
            wheelSection.tint = tint;
            wheelContainer.addChild(wheelSection);

            const wheelSectionText = new PIXI.Text(`${credits}`, style);
            wheelSectionText.name = `wheelSectionText${i}`;
            wheelSectionText.width = 80;
            wheelSectionText.position = { x: -40, y: -400 };
            wheelSection.addChild(wheelSectionText);
        });

        return wheelContainer;
    }

	/**
	 * Create the bonus screen wheel center, clicked to start a spin
	 *
	 * @private
	 * @returns {PIXI.Sprite}
	 */
    _createWheelCenter() {
		const wheelCenter = PIXI.Sprite.from(PIXI.Assets.get('wheelCenter'));
		wheelCenter.name = 'wheelCenter';
		wheelCenter.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
		wheelCenter.on('pointerdown', () => this._onClick());
		this.screenContainer.addChild(wheelCenter);

        return wheelCenter;
    }

	/**
	 * Create the bonus screen wheel pin, indicates where the win is
	 *
	 * @private
	 */
    _createWheelPin() {
		const wheelPin = PIXI.Sprite.from(PIXI.Assets.get('pointer'));
		wheelPin.name = 'wheelPin';
		wheelPin.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
        wheelPin.position = { x: 0, y: -460 };
		this.screenContainer.addChild(wheelPin);
    }

    /**
     * Enables the bonus screen
     *
     * @private
     */
    _enable() {
		this._wheelCenter.interactive = true;
    }

    /**
     * Disables the bonus screen
     *
     * @private
     */
    _disable() {
		this._wheelCenter.interactive = false;
    }

    /**
     * Spin the wheel, show the result and end
     *
     * @async
     * @private
     */
    async _onClick() {
        console.log(`Bonus Wheel Clicked`);

        this._bonusText.visible = false;
        this._disable();
        await this._spin();
        this._end();
    }

    /**
     * Determine the result and spin in the wheel
     *
     * @async
     * @private
     */
    async _spin() {
        console.log(`Bonus Wheel Spin`);

        const { angle, credits } = this._getResult();

        console.log(`Bonus Wheel Result`, angle, credits);

        // spin and slow to the correct result over a second
        const wheelSlowTween = new Tween(this._wheelContainer, { angle: 0 }, { angle: 360 + angle, duration: 1, ease: "sine.out" });
        soundPlayer.play("spin");
        await wheelSlowTween.start();
        soundPlayer.play("land");

        this._wheelContainer.angle = angle;
        await this._onWin(credits);
    }

    /**
     * Get the result for the spin
     *
     * @async
     * @private
     * @returns {BonusScreen_ResultData}
     */
    _getResult(): BonusResult {
        const totalWeight = this._getTotalWeight();
        let targetWeight = this._randomIntBetween(0, totalWeight);

        if (this._forceWeight > -1) {
            // if the weight has been forced by the debugger, use that
            targetWeight = this._forceWeight;
        }

        console.log(`Bonus Wheel Target`, totalWeight, targetWeight);

        let result = {
            credits: 0,
            angle: 0
        };
        let cumulativeWeight = 0;
        this._wheelData.forEach(({ angle, credits, tint, weight }, i) => {
            const min = cumulativeWeight;
            const max = min + weight;

            cumulativeWeight += weight;

            if (targetWeight >= min && targetWeight < max) {
                console.log(`Bonus Wheel Result`, min, ` <= `, targetWeight, ` < `, max);
                result = {
                    credits,
                    angle: 360 - this._randomIntBetween(angle - 21, angle + 21) // account for black area between segments
                };
            }
        });
        return result;
    }

    /**
     * Returns the total weight in the wheel data
     *
     * @returns {number}
     */
    _getTotalWeight() {
        let totalWeight = 0;
        this._wheelData.forEach(({ angle, credits, tint, weight }, i) => {
            totalWeight += weight;
        });
        return totalWeight;
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

    /**
     * Play the outro tween and resolve the promise when bonus screen ends
     *
     * @async
     * @private
     */
    async _end() {
        console.log(`Bonus Screen Ended`);

        await this._fadeOutTween.start();
        this.screenContainer.visible = false;

        if (this._resolver) {
            this._resolver();
            this._resolver = undefined;
        }
    }
}

export default BonusScreen;