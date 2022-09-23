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
}

/**
 * Class scene in end view
 */
export default class EndScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('EndScene');
    }

    /**
     * Init the scene with data sent in another scene
     * @param {int} data - collect the data sent from the previous scene
     */
    init(data) {
        this.data = data;
        // TODO get data from last scene
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.svg('btnClassic', 'assets/btnClassic.svg');
        this.load.svg('btnClassicHover', 'assets/btnClassicHover.svg');
        this.load.svg('board', 'assets/board.svg');
        // TODO Load assets

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
            callback: ()=> {
                this.startSound.stop();
                this.startSound = this.sound.add('start');
                this.startSound.play();
            },
            loop: true
        });

        // Init border menu
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'board')
        .setScale(gameOptions.boardScale);

        let titleMenu = this.add.text(null,null,gameOptions.titleText,{
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        });

        // Center Text
        titleMenu.x = this.game.config.width / 2 - titleMenu.width / 2;
        titleMenu.y = this.game.config.height * 0.09 - titleMenu.height / 2;

        // Init retry button
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
                retry.clearTint();
            })
            .on("pointerout", () => {
                btn.clearTint();
                retry.clearTint();
              })
            .on("pointerdown", () => this.goToStartScene());

        let retry = this.add
            .text(null,null,gameOptions.retryText)
            .setPadding(10)
            .setStyle({
                fontFamily: gameOptions.textFontFamily,
                // color: gameOptions.btnColor,
                color: gameOptions.textColor,
                fontSize: gameOptions.textFontSize
        });

        retry.x = this.game.config.width / 2 - retry.width / 2;
        retry.y = this.game.config.height * 0.35 - retry.height / 2;

        let endgameResult =
            this.data.chances <= 0 || this.data.level < 25
                ? "Vous avez perdu"
                : "Vous avez gagné";

        let resultText = this.add.text(null,null, endgameResult,{
            fontSize: gameOptions.textFontSize,
        });
        resultText.x = this.game.config.width / 2 - resultText.width / 2 + 10;
        resultText.y = this.game.config.height * 0.50 - resultText.height / 2;

        let liveText = this.add.text(
            null,
            null,
            "Chances restants: " +
                this.data.chances,
            {
                fontFamily: gameOptions.textFontFamily,
                fontSize: gameOptions.textFontSize,
                fill: gameOptions.titleColor
            }
        );

        liveText.x = this.game.config.width / 2 - liveText.width / 2 + 10;
        liveText.y = this.game.config.height * 0.69 - liveText.height / 2;








        // TODO init game object
    }

    /**
     * Go to Main scene
     */
    goToStartScene() {
        this.scene.restart('GameScene');
        this.scene.start('StartScene');
    }
}