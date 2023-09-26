/**
 * Customizable game options
 */
 let gameOptions = {
    // Color of background
    bgColor1: 0x414141,
    bgColor2: 0x000000,

    // Board scale
    boardScale: 2,

    // Buttons style
    btnScale: 1.3,
    btnTintColor: 0x9E9E9E,
    btnTintGray: 0x373737,
    btnTextTintColor: 0x9E9E9E,

    // Text font family
    titleColor: '#fff',
    titleFontSize: '70px',
    textFontFamily: 'Arial',
    textFontStyle: 'bold',
    textColor: '#fff',
    textFontSize: '30px',

    // Colors
    boardBackgroundColor: 0xC5C5C5,
    blue: 0x3e95f3,

    // Text content
    titleText: 'Partie ',

    // Text Chances Left
    titleChance: 'Vies restants: ',

    // Image Size
    imageScale: 0.65,
    imageSize: 400,

    numberImages: 4,
    images: [],

    // answerSlots
    answerSlotsSizeX:650,
    answerSlotsSizeY:650,
}


/**
 * Class scene in game mode
 */
export default class GameScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() { super('GameScene') }

    /**
     * Level button data
     *
     * @param {int} data - Allows you to determine the chosen level
     *
     */
    init(data2) {
        this.actualSeq = data2.numLevel;
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.json("json", "../levels/sequences.json");
        this.load.json('nextSeq', `../levels/level${this.actualSeq +1}.json`);
    }

    /**
     * Create and init assets
     */
    create() {
        let jsonDataBE = this.cache.json.get('json');
        let jsonDataActualSeq = this.cache.json.get('nextSeq');

        let nbSeq = jsonDataBE.sequence.length
        let nextGameType = jsonDataActualSeq.gameType

        if(this.actualSeq > nbSeq-2){
            this.stopSequence()
        } else {
            this.gameOver(this.actualSeq, nextGameType)
        }
    }

    /**
     * Go to end scene
     */
    gameOver(numLevel, nextGameType) {
        this.cache.json.remove('json');
        this.cache.json.remove('nextSeq');

        for (const key in this.cache.json.entries) {
            this.cache.json.remove(key);
        }

        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            if(nextGameType == "BESolver" || nextGameType == "BE") {
                this.scene.start("BEScene",{ numLevel: numLevel});
            } else if(nextGameType == "PlayGame") {
                console.log("go to play game")
                this.scene.start("PreLoader",{ numLevel: numLevel});
            } else if(nextGameType == "DRM") {
                this.scene.start("DRM",{ numLevel: numLevel});
            }
        });
    }

    /**
     * Go to end page test after sequence
     */
    stopSequence(){
        this.cache.json.remove('json');

        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("EndScene");
        });
    }
}