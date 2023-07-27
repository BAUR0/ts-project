import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";
import Tween from "../lib/tween";
import Screen, { ScreenInitData } from "./screen";

/**
 * Win Screen
 *
 * @class WinScreen
 * @extends Screen
 */
class WinScreen extends Screen {

    private _time: number;
    private _winText: PIXI.Text;
    private _winEmitter: Emitter;

	constructor(initData: ScreenInitData) {
        super(initData);

        const winGlow = this._createGlow();
        this._winText = this._createText();
        this._winEmitter = this._createEmitter();

        // add a delay to the fadeOutTween
        this._fadeOutTween = new Tween(this.screenContainer, { alpha: 1 }, { alpha: 0, delay: 2 });
        new Tween(winGlow, { angle: 0 }, { angle: 360, repeat: -1, ease: "linear", duration: 5 }).start();

        this._time = Date.now();
        this._update();
    }

    /**
     * Show the win screen and the result
     *
     * @async
     * @param {number} win - The amount of credits won
     */
    async start(win: number) {
        console.log(`Win Screen Started`);
        
        this.screenContainer.visible = true;
        this._winText.text = `YOU WON ${win} CREDITS!`;

        this._winEmitter.emit = true;
        await this._fadeInTween.start();
        this._winEmitter.emit = false;
        await this._fadeOutTween.start();
        this.screenContainer.visible = false;

        console.log(`Win Screen Ended`);
    }

	/**
	 * Create the win screen glow
	 *
	 * @private
	 * @returns {PIXI.Sprite}
	 */
    _createGlow() {
		const winGlowContainer = new PIXI.Container();
		winGlowContainer.name = 'winGlowContainer';
		winGlowContainer.scale = { x: 5, y: 2 };
		this.screenContainer.addChild(winGlowContainer);

        const winGlowMask = PIXI.Sprite.from(PIXI.Assets.get('sunBurst'));
		winGlowMask.name = 'winGlowMask';
		winGlowMask.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
		winGlowContainer.addChild(winGlowMask);

		const winGlow = PIXI.Sprite.from(PIXI.Assets.get('sunBurst'));
		winGlow.name = 'winGlow';
		winGlow.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
        winGlow.tint = "#ff00ff";
        winGlow.mask = winGlowMask;
		winGlowContainer.addChild(winGlow);

        return winGlow
    }

	/**
	 * Create the win screen text
	 *
	 * @private
	 * @returns {PIXI.Text}
	 */
    _createText() {
        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 50,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#000000',
            stroke: "#FFFFFF",
            strokeThickness: 5
		});

        const winText = new PIXI.Text(``, style);
		winText.name = 'winText';
		winText.position = { x: -300, y: -25 };
		this.screenContainer.addChild(winText);

        return winText;
    }

	/**
	 * Create the particle emitter
	 *
	 * @private
	 * @returns {Emitter}
	 */
    _createEmitter() {
		const winEmitterContainer = new PIXI.Container();
		winEmitterContainer.name = 'winEmitterContainer';
		this.screenContainer.addChild(winEmitterContainer);

        return new Emitter(winEmitterContainer, {
            addAtBack: true,
            behaviors: [
                {
                    type: "moveAcceleration",
                    config: {
                        accel: {
                            x: 0, 
                            y: 600
                        },
                        maxSpeed: 0,
                        maxStart: 500,
                        minStart: 500,
                        rotate: true
                    }
                },
                {
                    type: "scale",
                    config: {
                        minMult: 1,
                        scale: {
                            list: [
                                { time: 0, value: 0.5 },
                                { time: 1, value: 4 }
                            ]
                        }
                    }
                },
                {
                    type: "colorStatic",
                    config: {
                        color: "#ffffff"
                    }
                },
                {
                    type: "rotation",
                    config: {
                        accel: 0,
                        maxSpeed: 180,
                        maxStart: 300,
                        minSpeed: -180,
                        minStart: 240
                    }
                },
                {
                    type: 'animatedSingle',
                    config: {
                        anim: {
                            framerate: 25,
                            loop: true,
                            textures: [
                                { texture: PIXI.Texture.from('coin-anim-01.png') },
                                { texture: PIXI.Texture.from('coin-anim-02.png') },
                                { texture: PIXI.Texture.from('coin-anim-03.png') },
                                { texture: PIXI.Texture.from('coin-anim-04.png') },
                                { texture: PIXI.Texture.from('coin-anim-05.png') },
                                { texture: PIXI.Texture.from('coin-anim-06.png') }
                            ]
                        }
                    }
                },
                {
                    type: "spawnPoint",
                    config: {}
                }
            ],
            emit: false,
            emitterLifetime: 2000,
            frequency: 0.05,
            lifetime: {
                min: 2500,
                max: 2500
            },
            maxParticles: 250,
            pos: {
                x: 0,
                y: 0
            }
        });
    }

	/**
	 * Update our particle emitter
	 *
	 * @private
	 */
    _update() {
        window.requestAnimationFrame(() => this._update());

        const  now = Date.now();
        this._winEmitter.update((now - this._time) * 0.001);
        this._time = now;
    }
}

export default WinScreen;