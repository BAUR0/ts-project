import gsap from "gsap";

interface BasicObject {
    [key: string]: any
}

/**
 * Tween
 *
 * @class Tween
 */
class Tween {

    private _tween?: gsap.core.Tween & BasicObject; // we need BasicObject to be able to add members to _tween (startPromise)
    
	/**
     * @param {TweenTarget} targets
     * @param {TweenVars} fromVars
     * @param {TweenVars} toVars
	 */
	constructor(targets: any | any[], fromVars: object, toVars: object) {
        this._tween = gsap.fromTo(targets, fromVars, toVars);
        this._tween.pause();

        this._tween.startPromise = async () => {
            this._tween!.invalidate();
            await new Promise(resolve => {
                this._tween!.vars.onComplete = () => {
                    resolve(undefined);
                };
                this._tween!.restart(true);
            });
        };
    }

	/**
	 * Start the tween, we can await until it is done
	 *
	 * @async
	 */
    async start() {
        await this._tween!.startPromise();
    }
}

export default Tween;