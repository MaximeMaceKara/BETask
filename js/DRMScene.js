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
    animFadeSpeed:500,

    // Text font family
    titleColor: '#fff',
    titleFontSize: '70px',
    textFontStyle: 'bold',
    textColor: '#fff',
    textFontSize: '30px',

    // Colors
    boardBackgroundColor: 0xC5C5C5,
    blue: 0x3e95f3,

    // Text content
    titleText: 'BE ',

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

    // Text font family
    countDownTextColor: '#fff',
    countDownFontSize: 250,
    textFontFamily: 'Arial',
    textFontSize: 75,

    delay: 1000,
}

var isOver = false;

/**
 * Class scene in game mode
 */
export default class DRMScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('DRMScene')

        this.selectionRectangles = [];
        this.isSelecting = false;
        this.isDragging = false;
        this.selectionMode = 'largeur';
        this.widthButton = null;
        this.heightButton = null;
        this.moveButton = null;
        this.startX = 0;
        this.startY = 0;
        this.currentRect = null;
    }

    /**
     * Level button data
     *
     * @param {int} data - Allows you to determine the chosen level
     *
     */
    init(data) {
        this.level = data.numLevel + 1;
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.json('DRMScene', `/levels/level${this.level}.json`);
    }

    /**
     * Create and init assets
     */
    create() {
        let jsonData = this.cache.json.get('DRMScene');
        isOver=false;

        // Change background color
        this.add.graphics()
            .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor2, 1)
            .fillRect(0, 0, this.game.config.width, this.game.config.height);

        // Level title
        let titleLevel = this.add.text(null, null, jsonData.gameType + this.level, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.textFontSize,
            fill: gameOptions.titleColor,
        })

        titleLevel.x = 50;
        titleLevel.y = this.game.config.height * 0.08 - titleLevel.height / 2;

        // Instantiate timer and display
        this.timer = this.time.addEvent({
            delay: gameOptions.delay,
            callback: this.secondCounter,
            callbackScope: this,
            loop: true,
        });

        this.timer = jsonData.timer;

        this.chronoText = this.add.text(null, null, this.timer, {
            fontSize: gameOptions.textFontSize,
            fill: gameOptions.countDownTextColor,
        });

        this.chronoText.x = this.game.config.width - 100;
        this.chronoText.y = this.game.config.height * 0.08 - titleLevel.height / 2;

        // Init circle decoration
        const circleRadius =  720;
        this.circle = this.add.circle(this.cameras.main.centerX, this.cameras.main.centerY, circleRadius, gameOptions.bgColor1);
        this.circle.setAlpha(0.5);
    }

    /**
     * Method loaded every time
     */
    update() {
        this.chronoText.setText(this.timer);

        if(this.timer <= 0 && isOver == false){
            isOver = true
            this.gameOver();
        }
    }

    /**
     * Timer manager
    */
    secondCounter() { this.timer-- }

    /**
     * Go to end scene
     */
    gameOver(){
        this.cache.json.remove('DRMScene');

        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene', {numLevel: this.level});
        });
    }
}