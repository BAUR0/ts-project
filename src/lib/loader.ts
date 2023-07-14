import { Assets } from 'pixi.js';
import { Howl } from "howler";
import { soundPlayer } from "../game";

interface LoaderAsset {
    id: string,
    src: string
}

/**
 * Used to load all game assets
 *
 * @class Load
 */
class Loader {

    private readonly _textures: LoaderAsset[];
    private readonly _sounds: LoaderAsset[];
    private _resolver?: Function;
    private _soundsLoaded: number;
    private _onSoundLoadedPromise?: Function;

	constructor() {
        this._textures = [
			{ id: 'bg', src: '/assets/images/background.png' },
			{ id: 'coin', src: '/assets/images/coin-anim.json' },
			{ id: 'glow', src: '/assets/images/glow.png' },
			{ id: 'play', src: '/assets/images/play.png' },
			{ id: 'pointer', src: '/assets/images/pointer.png' },
			{ id: 'sunBurst', src: '/assets/images/sunburst.png' },
			{ id: 'wheelCenter', src: '/assets/images/wheel-center.png' },
			{ id: 'wheelSlice', src: '/assets/images/wheel-slice.png' }
        ];
        this._sounds = [
            { id: "win", src: "/assets/sounds/credits-rollup.wav" },
            { id: "spin", src: "/assets/sounds/wheel-click.wav" },
            { id: "land", src: "/assets/sounds/wheel-landing.wav" }
        ];
        this._resolver = undefined;
        this._soundsLoaded = 0;
        this._onSoundLoadedPromise = undefined;
    }

    /**
     * Start loading the assets
     *
     * @returns {Promise}
     */
    start() {
        return new Promise(async resolve => {
            this._resolver = resolve;

            console.log(`Load Started`);
            
            await this._load();
            this._end();

            console.log(Assets);
        });
    }

    /**
     * Load the assets
     *
     * @async
     * @private
     */
    async _load() {
        const ids: string[] = [];
        this._textures.forEach(({ id, src }) => {
            Assets.add(id, src);
            ids.push(id);
        });
        await Assets.load(ids, (progress) => this._onProgress(progress));
        await this._loadSounds();
    }

    /**
     * Progress during the loading
     *
     * @private
     * @param {number} progress - represents the percentage (0.0 - 1.0) of the assets loaded
     */
    _onProgress(progress: number) {
		console.log(`Load progress: ${progress}`);
    }

    /**
     * Load sounds using Howler
     *
     * @private
     * @returns {Promise}
     */
    _loadSounds() {
        this._soundsLoaded = 0;

        return new Promise((resolve) => {
            this._sounds.forEach(({ id, src }: LoaderAsset) => {
                const howl = new Howl({
                    src,
                    autoplay: false,
                    loop: false,
                    mute: false,
                    rate: 1.0,
                    volume: 1.0
                });
                howl.once("load", () => {
                    this._onSoundLoaded(id, howl);
                });
                howl.once("loaderror", (id, error) => {
                    console.log(`Sound with id ${id} failed to load with error "${error}".`);
                });
            });
            this._onSoundLoadedPromise = resolve;
        });
    }

    /**
     * A sound has been loaded
     *
     * @private
     * @param {string} id - Unique identifier for the sound
     * @param {Howl} howl - Instance of Howl
     */
    _onSoundLoaded(id: string, howl: Howl) {
        soundPlayer.add(id, howl);

        if (++this._soundsLoaded === this._sounds.length && this._onSoundLoadedPromise) {
            this._onSoundLoadedPromise();
        }
    }

    /**
     * Resolve the promise once our assets are all loaded
     *
     * @private
     */
    _end() {
        console.log(`Load Ended`);

		// remove our loading elements
		const loadingIcon = document.getElementById( 'loading-icon' )!;
        loadingIcon.parentNode!.removeChild(loadingIcon);

		const loadingGameName = document.getElementById( 'loading-game-name' )!;
        loadingGameName.parentNode!.removeChild(loadingGameName);

        if (this._resolver) {
            this._resolver();
            this._resolver = undefined;
        }
    }
}

export default Loader;