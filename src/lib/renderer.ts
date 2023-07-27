import * as PIXI from "pixi.js";

/**
 * Creates and updates the renderer. Redraws the game container every frame.
 *
 * @class Renderer
 */
class Renderer {

	private _pixi: PIXI.Application;
	private _pixiRenderer: PIXI.IRenderer;
	private _gameContainer: PIXI.Container;

	constructor() {
        this._pixi = this._createRenderer();
        this._pixiRenderer = this._pixi.renderer;

        this._gameContainer = this._createGameLayer();
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
	 * Create the renderer
	 *
	 * @private
	 * @returns {PIXI.Application}
	 */
    _createRenderer() {
        PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;

        return new PIXI.Application({
            antialias: false,
            autoStart: false,
            clearBeforeRender: false,
            height: 1080,
            resolution: 1,
			view: document.getElementById('game-canvas') as HTMLCanvasElement,
            width: 1920
        });
    }

	/**
	 * Create the game layer
	 *
	 * @private
	 * @returns {PIXI.Container}
	 */
	_createGameLayer() {
		const gameContainer = new PIXI.Container();
		gameContainer.name = 'gameContainer';
		gameContainer.sortableChildren = true;
		gameContainer.pivot.set(-960, -540); // make 0,0 the center of the game
        this._pixi.stage.addChild(gameContainer);

		return gameContainer;
	}

	/**
	 * Create the ticker
	 *
	 * @private
	 */
    _createTicker() {
		this._pixi.ticker.maxFPS = 60;
		this._pixi.ticker.add(this._onRenderTick, this);
        this._pixi.ticker.start();
    }

	/**
	 * When an update tick comes through, tell the PIXI renderer to render
	 *
	 * @private
	 */
	_onRenderTick() {
		this._pixiRenderer.render(this._pixi.stage);
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

		this._pixiRenderer.view.style!.width = `${w}px`;
		this._pixiRenderer.view.style!.height = `${h}px`;
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