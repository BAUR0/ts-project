import * as PIXI from "pixi.js";
import Tween from "../lib/tween";
import { soundPlayer } from "../game";

interface UserInterfaceInitData {
    layer: PIXI.Container
}

/**
 * User Interface
 *
 * @class UserInterface
 */
class UserInterface {

    private _layer: PIXI.Container;
    private _balance: number;
    private _balanceText: PIXI.Text;

	constructor(initData: UserInterfaceInitData) {
        const { layer } = initData;

        this._layer = layer;
        this._balance = 1000;
        this._balanceText = this._createBalanceText();
    }

    /**
     * The balance
     * 
     * @member {number}
     * @returns {number}
     */
    get balance() {
        return this._balance;
    }
	set balance(balance: number) {
        this._balance = Math.floor(balance);
		this._balanceText.text = `Credits: ${this._balance}`;
	}

	/**
	 * Add the win to the balance
	 *
	 * @async
     * @param {number} win - The amount of credits won
	 */
    async win(win: number) {
        const soundId = soundPlayer.play("win", true);

        const balance = this._balance;
        const tween = new Tween(this, { balance }, { balance: balance + win, duration: 2 });
        await tween.start();

        soundPlayer.stop("win", soundId!);
        this.balance = balance + win;
    }

	/**
	 * Create the balance text
	 *
	 * @private
	 * @returns {PIXI.Text}
	 */
    _createBalanceText() {
        const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontWeight: 'bold',
			fill: '#ffffff'
		});

        const balanceText = new PIXI.Text(`Credits: ${this._balance}`, style);
		balanceText.name = 'balanceText';
		balanceText.position = { x: 500, y: 400 };
		this._layer.addChild(balanceText);

        return balanceText;
    }
}

export default UserInterface;