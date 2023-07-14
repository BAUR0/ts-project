import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";
import Tween from "../lib/tween";

interface WinScreenInitData {
    layer: PIXI.Container
}

/**
 * Win Screen
 *
 * @class WinScreen
 */
class WinScreen {

    private readonly _layer: PIXI.Container;
    private _time: number;
    private _winScreen?: PIXI.Container;
    private _winGlowContainer?: PIXI.Container;
    private _winGlowMask?: PIXI.Sprite;
    private _winGlow?: PIXI.Sprite;
    private _winEmitterContainer?: PIXI.Container;
    private _winEmitter?: Emitter;
    private _winText?: PIXI.Text;
    private _fadeInTween?: Tween;
    private _fadeOutTween?: Tween;
    private _rotateTween?: Tween;

	constructor(initData: WinScreenInitData) {
        const { layer } = initData;

        this._layer = layer;
        this._time = Date.now();

        this._create();
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
        
        this._winScreen!.visible = true;
        this._winText!.text = `YOU WON ${win} CREDITS!`;

        this._winEmitter!.emit = true;
        await this._fadeInTween!.start();
        this._winEmitter!.emit = false;
        await this._fadeOutTween!.start();
        this._winScreen!.visible = false;

        console.log(`Win Screen Ended`);
    }

	/**
	 * Create the win screen
	 *
	 * @private
	 */
    _create() {
		this._winScreen = new PIXI.Container();
		this._winScreen.name = 'winScreen';
        this._winScreen.visible = false;
        this._winScreen.alpha = 0;
		this._layer.addChild(this._winScreen);

		this._winGlowContainer = new PIXI.Container();
		this._winGlowContainer.name = 'winGlowContainer';
		this._winGlowContainer.scale = { x: 5, y: 2 };
		this._winScreen.addChild(this._winGlowContainer);

        this._winGlowMask = PIXI.Sprite.from(PIXI.Assets.get('sunBurst'));
		this._winGlowMask.name = 'winGlowMask';
		this._winGlowMask.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
		this._winGlowContainer.addChild(this._winGlowMask);

		this._winGlow = PIXI.Sprite.from(PIXI.Assets.get('sunBurst'));
		this._winGlow.name = 'winGlow';
		this._winGlow.anchor = new PIXI.ObservablePoint(() => {}, this, 0.5, 0.5);
        this._winGlow.tint = "#ff00ff";
        this._winGlow.mask = this._winGlowMask;
		this._winGlowContainer.addChild(this._winGlow);
        
        this._rotateTween = new Tween(this._winGlow, { angle: 0 }, { angle: 360, repeat: -1, ease: "linear", duration: 5 });
        this._rotateTween.start();

        this._createEmitter();

        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 50,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#000000',
            stroke: "#FFFFFF",
            strokeThickness: 5
		});

        this._winText = new PIXI.Text(``, style);
		this._winText.name = 'winText';
		this._winText.position = { x: -300, y: -25 };
		this._winScreen.addChild(this._winText);

        this._fadeInTween = new Tween(this._winScreen, { alpha: 0 }, { alpha: 1 });
        this._fadeOutTween = new Tween(this._winScreen, { alpha: 1 }, { alpha: 0, delay: 2 });
    }

	/**
	 * Create the particle emitter
	 *
	 * @private
	 */
    _createEmitter() {
		this._winEmitterContainer = new PIXI.Container();
		this._winEmitterContainer.name = 'winEmitterContainer';
		this._winScreen!.addChild(this._winEmitterContainer);

        this._winEmitter = new Emitter(this._winEmitterContainer, {
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
                // {
                //     type: 'animatedSingle',
                //     config: {
                //         anim: {
                //             framerate: 25,
                //             loop: true,
                //             textures: [
                //                 PIXI.Texture.from('coin-anim-01.png'),
                //                 PIXI.Texture.from('coin-anim-02.png'),
                //                 PIXI.Texture.from('coin-anim-03.png'),
                //                 PIXI.Texture.from('coin-anim-04.png'),
                //                 PIXI.Texture.from('coin-anim-05.png'),
                //                 PIXI.Texture.from('coin-anim-06.png')
                //             ]
                //         }
                //     }
                // },
                {
                    type: 'textureSingle',
                    config: {
                        texture: PIXI.Texture.from('coin-anim-01.png')
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
        this._winEmitter!.update((now - this._time) * 0.001);
        this._time = now;
    }
}

export default WinScreen;