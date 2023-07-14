import { Howl } from "howler";

/**
 * Sound Player
 *
 * @class SoundPlayer
 */
class SoundPlayer {

    private _sounds: Map<string, Howl>;

	constructor() {
        this._sounds = new Map();
    }

    /**
     * Add a sound to the sounds map
     *
     * @param {string} id - Unique identifier for the sound
     * @param {Howl} howl - Instance of Howl
     */
    add(id: string, howl: Howl) {
        if (!this._sounds.has(id)) {
            this._sounds.set(id, howl);
        }
    }

    /**
     * Play the sound with the id provided if it is present in the sounds map
     *
     * @param {string} id - Unique identifier for the sound
     * @param {boolean} [loop=false] - True if we want the sound to loop
     * @returns {?number} - The sound id to be used with other methods
     */
    play(id: string, loop = false) {
        if (this._sounds.has(id)) {
            const howl = this._sounds.get(id)!;
            const soundId = howl.play();

            if (loop) {
                howl.loop(loop, soundId);
            }

            return soundId;
        }
        return null;
    }
    
    /**
     * Stops playback of sound with the id and soundId provided
     *
     * @param {string} id - Unique identifier for the sound
     * @param {number} soundId - The sound id of the Howl that is already playing
     */
    stop(id: string, soundId: number) {
        if (this._sounds.has(id)) {
            const howl = this._sounds.get(id)!;
            howl.stop(soundId);
        };
    }
}

export default SoundPlayer;