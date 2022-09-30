let gameOptions = {
    // Color of background
    bgColor1: 0x151820,
    bgColor2: 0x3b446c,
    bgColor3: 0x3b446c,
    bgColor4: 0x6d759e,
    bgColor5: 1,

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
    textFontSize: '25px',

    // Color of board background
    boardBackgroundColor: 0xC5C5C5,

    // Text content
    titleText: 'Fin de partie',
    retryText: 'Recommencer',
    lifeScore: "Chances restants: ",
    winText: "Vous avez gagné",
    looseText: "Vous avez perdu"
}

/**
 * Class scene in end view
 */
export default class EndScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() { super('EndScene') }

    /**
     * Init the scene with data
     *
     * @param {int} data - collect the data
     */
    init(data) { this.data = data; }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.svg('btnClassic', 'assets/btnClassic.svg');
        this.load.svg('btnClassicHover', 'assets/btnClassicHover.svg');
        this.load.svg('board', 'assets/board.svg');

        // Load Sound
        this.load.audio('start',['./sounds/start.wav']);
    }

    /**
     * Create and init assets
     */
    create() {
        this.add.graphics()
            .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor3, gameOptions.bgColor4, gameOptions.bgColor5)
            .fillRect(0, 0, this.game.config.width, this.game.config.height);

        this.startSound = this.sound.add('start');
        this.startSound.play();

        this.time.addEvent({
            delay: 90000,
            callback:() => {
                this.startSound.stop();
                this.startSound = this.sound.add('start');
                this.startSound.play();
            },
            loop: true
        });

        // Init border menu
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'board')
            .setScale(gameOptions.boardScale);

        // Title menu
        let titleMenu = this.add.text(null,null,gameOptions.titleText,{
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        });

        titleMenu.x = this.game.config.width / 2 - titleMenu.width / 2;
        titleMenu.y = this.game.config.height * 0.09 - titleMenu.height / 2;

        // Retry button
        let btn = this.add
            .image(
                this.game.config.width / 2,
                this.game.config.height * 0.35,
                "btnClassic"
            )
            .setScale(gameOptions.btnScale)
            .setInteractive()
            .on("pointerover",()=>{
                btn.setTint(gameOptions.btnTintColor);
                btnText.clearTint();
            })
            .on("pointerout", () => {
                btn.clearTint();
                btnText.clearTint();
              })
            .on("pointerdown", () => this.goToStartScene());

        // Button text
        let btnText = this.add.text(null,null,gameOptions.retryText)
            .setPadding(10)
            .setStyle({
                fontFamily: gameOptions.textFontFamily,
                color: gameOptions.textColor,
                fontSize: gameOptions.textFontSize
        });

        btnText.x = this.game.config.width / 2 - btnText.width / 2;
        btnText.y = this.game.config.height * 0.35 - btnText.height / 2;

        // State endgame
        let endgameResult =
            this.data.chances <= 0 || this.data.level < 25
                ? gameOptions.looseText
                : gameOptions.winText;

        // Result text
        let resultText = this.add.text(null,null, endgameResult,{
            fontSize: gameOptions.textFontSize,
        });

        resultText.x = this.game.config.width / 2 - resultText.width / 2 + 10;
        resultText.y = this.game.config.height * 0.50 - resultText.height / 2;

        // Life text
        let liveText = this.add.text(
            null,
            null,
            gameOptions.lifeScore +
                this.data.chances,
            {
                fontFamily: gameOptions.textFontFamily,
                fontSize: gameOptions.textFontSize,
                fill: gameOptions.titleColor
            }
        );

        liveText.x = this.game.config.width / 2 - liveText.width / 2 + 10;
        liveText.y = this.game.config.height * 0.69 - liveText.height / 2;
    }

    /**
     * Go to Main scene
     */
    goToStartScene() {
        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('StartScene');
        });
    }
}