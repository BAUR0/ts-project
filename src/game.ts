import Loader from "./lib/loader";
import Renderer from "./lib/renderer";
import SoundPlayer from "./lib/soundPlayer";
import UserInterface from "./ui/userInterface";
import Background from "./screens/background";
import BonusScreen from "./screens/bonusScreen";
import DebugScreen from "./screens/debugScreen";
import TitleScreen from "./screens/titleScreen";
import WinScreen from "./screens/winScreen";

export const soundPlayer = new SoundPlayer();

/**
 * The entry point of the game which controls the loading and creation of the game elements.
 *
 * @class Game
 */
class Game {

	private readonly _loader: Loader;
	private readonly _renderer: Renderer;
	private _bg?: Background;
	private _bonusScreen?: BonusScreen;
	private _winScreen?: WinScreen;
	private _titleScreen?: TitleScreen;
	private _ui?: UserInterface;
	private _debugScreen?: DebugScreen;

	constructor() {
		this._loader = new Loader();
		this._renderer = new Renderer();
	}

	/**
	 * Initialise the game
	 *
	 * @async
	 */
    async init() {
        await this._loader.start();
        this._create();
		this._start();
    }

	/**
	 * Create the game
	 *
	 * @private
	 */
	_create() {
        this._bg = new Background({
            layer: this._renderer.gameContainer!
        });

		this._bonusScreen = new BonusScreen({
            layer: this._renderer.wheelContainer!,
			onWin: async (win: number) => await this._onWin(win)
		});

		this._winScreen = new WinScreen({
            layer: this._renderer.wheelContainer!,
		});

		this._titleScreen = new TitleScreen({
            layer: this._renderer.wheelContainer!
		});

        this._ui = new UserInterface({
            layer: this._renderer.uiContainer!
        });

        this._debugScreen = new DebugScreen({
            layer: this._renderer.debugContainer!,
			onDebug: (weight: number) => this._bonusScreen!.forceWeight = weight
        });
    }

	/**
	 * Start the game
	 *
	 * @private
	 */
	async _start() {
		await this._titleScreen!.start();
		await this._bonusScreen!.start();

		this._start();
	}

	/**
	 * The user has won
	 *
	 * @async
	 * @private
     * @param {number} win - The amount of credits won
	 */
	async _onWin(win: number) {
		await Promise.all([
			this._ui!.win(win),
			this._winScreen!.start(win)
		]);
	}
}

export default Game;