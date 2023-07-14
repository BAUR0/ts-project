import * as PIXI from "pixi.js";

/**
 * Creates and updates the renderer. Redraws the game container every frame.
 *
 * @class Renderer
 */
class Renderer {

	private _gameContainer?: PIXI.Container;
	private _wheelContainer?: PIXI.Container;
	private _uiContainer?: PIXI.Container;
	private _debugContainer?: PIXI.Container;
	private _pixi?: PIXI.Application;
	private _pixiRenderer?: PIXI.IRenderer;

	constructor() {
        this._createRenderer();
        this._createGameLayers();
        this._createTicker();
        this._createResize();
        // this._enablePixiInspector();
    }

	/**
	 * The container for the game
	 *
	 * @readonly
	 * @member {PIXI.Container}
	 */
	get gameContainer() {
		return this._gameContainer;
	}

	/**
	 * The container for the wheel
	 *
	 * @readonly
	 * @member {PIXI.Container}
	 */
	get wheelContainer() {
		return this._wheelContainer;
	}

	/**
	 * The container for the ui
	 *
	 * @readonly
	 * @member {PIXI.Container}
	 */
	get uiContainer() {
		return this._uiContainer;
	}

	/**
	 * The container for the debug
	 *
	 * @readonly
	 * @member {PIXI.Container}
	 */
	get debugContainer() {
		return this._debugContainer;
	}

	/**
	 * Create the renderer
	 *
	 * @private
	 */
    _createRenderer() {
        PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;

        this._pixi = new PIXI.Application({
            antialias: false,
            autoStart: false,
            clearBeforeRender: false,
            height: 1080,
            resolution: 1,
			view: document.getElementById('game-canvas') as HTMLCanvasElement,
            width: 1920
        });
        this._pixiRenderer = this._pixi.renderer;

        this._resize();

		// const viewport = document.getElementById('viewport')!;
        // viewport.appendChild(this._pixi.view);
    }

	/**
	 * Create the game layers
	 *
	 * @private
	 */
    _createGameLayers() {
		this._gameContainer = new PIXI.Container();
		this._gameContainer.name = 'gameContainer';
		this._gameContainer.sortableChildren = true;
		this._gameContainer.pivot.set(-960, -540); // make 0,0 the center of the game
        this._pixi!.stage.addChild(this._gameContainer);

		this._wheelContainer = new PIXI.Container();
		this._wheelContainer.name = 'wheelContainer';
		this._wheelContainer.zIndex = 100;
		this._gameContainer.addChild(this._wheelContainer);

		this._uiContainer = new PIXI.Container();
		this._uiContainer.name = 'uiContainer';
		this._uiContainer.zIndex = 200;
		this._gameContainer.addChild(this._uiContainer);

		this._debugContainer = new PIXI.Container();
		this._debugContainer.name = 'debugContainer';
		this._debugContainer.zIndex = 300;
		this._gameContainer.addChild(this._debugContainer);
    }

	/**
	 * Create the ticker
	 *
	 * @private
	 */
    _createTicker() {
		this._pixi!.ticker.maxFPS = 60;
		this._pixi!.ticker.add(this._onRenderTick, this);
        this._pixi!.ticker.start();
    }

	/**
	 * When an update tick comes through, tell the PIXI renderer to render
	 *
	 * @private
	 */
	_onRenderTick() {
		this._pixiRenderer!.render(this._pixi!.stage);
	}

	/**
	 * Create the resize events
	 *
	 * @private
	 */
    _createResize() {
		const resize = () => this._resize();

		window.addEventListener('resize', resize);
		window.addEventListener('focusin', resize);
		window.addEventListener('pageshow', resize);
		window.addEventListener('orientationchange', resize);
    }

	/**
	 * Resize the renderer and viewport
	 *
	 * @private
	 */
	_resize() {
		const ratio = 1920 / 1080;
        const { innerHeight, innerWidth } = window;

		var w = innerWidth;
		var h = innerWidth / ratio;

		if (innerWidth / innerHeight >= ratio) {
			w = innerHeight * ratio;
			h = innerHeight;
		}

		this._pixiRenderer!.view!.style!.width = `${w}px`;
		this._pixiRenderer!.view!.style!.height = `${h}px`;
	}

    /**
     * Enable pixi inspector 
     * 
     * @private
     */
    _enablePixiInspector() {
        // pixi inspector ^2.X.X
        /* eslint-disable-next-line */
        // globalThis.__PIXI_APP__ = this._pixi;

        // pixi inspector ^0.X.X - legacy pixi inspector can probably be removed in future
        /* eslint-disable no-underscore-dangle */
        // window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
    }
}

export default Renderer;