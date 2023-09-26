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
    btnScale: 1,
    btnTintColor: 0x9E9E9E,
    btnTintGray: 0x373737,
    btnTextTintColor: 0x9E9E9E,

    // Text font family
    titleColor: '#fff',
    titleFontSize: '70px',
    textFontFamily: 'Arial',
    textFontStyle: 'bold',
    textColor: '#fff',
    textFontSize: '25px',

    // Color of board background
    boardBackgroundColor: 0xC5C5C5,

    // Text content
    titleText: 'BE task',
    btnText: 'Jouer',

    // Anim params
    animFadeSpeed:500,
}


/**
 * Class scene in start view
 */
export default class StartScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() { super('StartScene') }

    /**
     * Preload assets
     */
    preload() {
        this.load.svg('btnClassic', 'assets/btnClassic.svg');
        this.load.svg('btnClassicHover', 'assets/btnClassicHover.svg');
        this.load.svg('board', 'assets/board.svg');
        this.load.audio('start',['./sounds/start.wav']);
    }

    /**
     * Create and init game assets
     */
    create() {
        // Init sound
        let startSound = this.sound.add('start');
        startSound.play();

        // Init board
        this.add.graphics()
            .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor2, 1)
            .fillRect(0, 0, this.game.config.width, this.game.config.height);

        this.time.addEvent({
            delay: 90000,
            callback: () => {
                startSound.stop();
                startSound = this.sound.add('start');
                startSound.play();
            },
            loop: true
        })

        // Init border menu
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'board')
            .setScale(gameOptions.boardScale);

        // Title menu
        let titleMenu = this.add.text(null, null, gameOptions.titleText, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        })

        titleMenu.x = this.game.config.width / 2 - titleMenu.width / 2;
        titleMenu.y = this.game.config.height * 0.09 - titleMenu.height / 2;

        // Init start button
        let btn = this.add.image(this.game.config.width / 2, (this.game.config.height) * 0.32, 'btnClassic')
            .setScale(gameOptions.btnScale)
            .setInteractive()
            .on('pointerover', () => {
                btn.setTint(gameOptions.btnTintColor)
                btnText.setTint(gameOptions.btnTextTintColor)
            })
            .on('pointerout', () => {
                btn.clearTint()
                btnText.clearTint()
            }).on('pointerdown', () => this.goToLevelScene())

        // Init text button title
        let btnText = this.add.text(null, null, gameOptions.btnText)
            .setPadding(10)
            .setStyle({
                fontFamily: gameOptions.textFontFamily,
                color: gameOptions.textColor,
                fontSize: gameOptions.textFontSize
            });

        btnText.x = this.game.config.width / 2 - btnText.width / 2;
        btnText.y = this.game.config.height * 0.32 - btnText.height / 2;
    }

    /**
     * Go to Main scene
     */
    goToLevelScene() {
        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        let initNumLevel = 0

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("GameScene", { numLevel: initNumLevel });
        });
    }
}