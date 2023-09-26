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
export default class BEScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('BEScene')

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
        this.load.json('BE', `/levels/level${this.level}.json`);
    }

    /**
     * Create and init assets
     */
    create() {
        let jsonData = this.cache.json.get('BE');
        isOver=false;

        this.loader = this.lazyLoadingImg(jsonData.image, this.level);

        // Change background color
        this.add.graphics()
            .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor2, 1)
            .fillRect(0, 0, this.game.config.width, this.game.config.height);

        // Level title
        let titleLevel = this.add.text(null, null, jsonData.gameType + "-" + this.level, {
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

        if(jsonData.gameType == "BESolver") { this.selectorArea(); }
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
     * Check if rectangle area already exist
     *
     * @returns
     */
    findExistingRectangle() {
        return this.selectionRectangles.length > 0 ? this.selectionRectangles[0] : null;
    }

    /**
     * Add area to select in image
     */
    selectorArea() {
        const initialRect = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 200, 200, 0x000000, 0.2).setStrokeStyle(2, 0xffffff).setDepth(1);
        const self = this;

        this.nextButton = this.add.text(this.game.config.width - this.game.config.width / 10, this.game.config.height - 55, 'Suivant',
        {
            fill: '#000000',
            backgroundColor: "#ffffff",
            borderRadius:25,
            padding:10,
            fontSize:20,
        });

        this.nextButton.x = this.game.config.width - this.game.config.width / 10 - this.nextButton.width /2

        this.nextButton.setInteractive();
        this.nextButton.on('pointerdown', () => {
            this.timer = -1
        });

        this.selectionRectangles.push(initialRect);
        this.widthButton = this.add.text(this.game.config.width / 2 - this.game.config.width / 4, this.game.config.height - 55, 'Largeur', 
        {
            fill: '#000000',
            backgroundColor: "#ffffff",
            borderRadius:25,
            padding:10,
            fontSize:20,
        });

        this.widthButton.x = this.game.config.width / 2 - this.game.config.width / 4 - this.widthButton.width /2


        this.widthButton.setInteractive();
        this.widthButton.on('pointerdown', () => {
            if(this.selectionMode != 'largeur') {
                this.selectionMode = 'largeur';
                this.widthButton.setStyle({ fill: '#00ff00' });
                this.heightButton.setStyle({ fill: '#000000' });
            } else {
                this.selectionMode = '';
                this.widthButton.setStyle({ fill: '#000000' });
            }
        });

        this.heightButton = this.add.text(this.game.config.width / 2, this.game.config.height - 55, 'Hauteur', 
        {
            fill: '#000000',
            backgroundColor: "#ffffff",
            borderRadius:25,
            padding:10,
            fontSize:20,
        });

        this.heightButton.x = this.game.config.width / 2- this.heightButton.width /2

        this.heightButton.setInteractive();
        this.heightButton.on('pointerdown', () => {
            if(this.selectionMode != 'hauteur') {
                this.selectionMode = 'hauteur';
                this.heightButton.setStyle({ fill: '#00ff00' });
                this.widthButton.setStyle({ fill: '#000000' });
            } else {
                this.selectionMode = '';
                this.heightButton.setStyle({ fill: '#000000' });
            }
        });

        this.input.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.currentRect = this.findExistingRectangle();

            if (this.currentRect) {
                this.isSelecting = true;
            } else {
                this.isSelecting = true;
                const selectionRect = this.add.rectangle(this.startX, this.startY, 0, 0, 0x000000, 0.2);
                this.selectionRectangles.push(selectionRect);
                this.currentRect = selectionRect;
            }
        });

        this.input.on('pointerup', () => {
            this.isSelecting = false;
            const x = this.currentRect.x;
            const y = this.currentRect.y;
            const width = this.currentRect.width;
            const height = this.currentRect.height;

            console.log('Sélection : x=', x, 'y=', y, 'largeur=', width, 'hauteur=', height);
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isSelecting) {
                if (this.selectionMode === 'largeur') {
                    const width = pointer.x - this.startX;
                    this.currentRect.setSize(width, this.currentRect.height);
                } else if (this.selectionMode === 'hauteur') {
                    const height = pointer.y - this.startY;
                    this.currentRect.setSize(this.currentRect.width, height);
                }
            }
        });

        let isMoveButtonActive = false;
        let movingRect = null;
        let offsetX = 0;
        let offsetY = 0;

        this.moveButton = this.add.text(this.game.config.width / 2 + this.game.config.width / 4, this.game.config.height - 55, 'Déplacer',
        {
            fill: '#000000',
            backgroundColor: "#ffffff",
            borderRadius:25,
            padding:10,
            fontSize:20,
        });

        this.moveButton.x = this.game.config.width / 2 + this.game.config.width / 4 - this.moveButton.width /2

        this.moveButton.setInteractive();
        this.moveButton.on('pointerdown', () => {
            isMoveButtonActive = !isMoveButtonActive;
            if(isMoveButtonActive) {
                this.selectionMode = 'deplacer';
                this.moveButton.setStyle({ fill:'#00ff00'});
                this.widthButton.setStyle({ fill:'#000000'});
                this.heightButton.setStyle({ fill:'#000000'});
            } else {
                this.selectionMode = 'none';
                this.moveButton.setStyle({ fill: '#000000' });
            }
        });

        this.input.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;

            this.currentRect = this.findExistingRectangle();

            if (this.currentRect) {
                if (isMoveButtonActive) {
                    this.isDragging = true;
                    movingRect = this.currentRect;
                    offsetX = movingRect.x - this.startX;
                    offsetY = movingRect.y - this.startY;
                }
            } else {
                if (this.selectionMode !== 'deplacer' || !isMoveButtonActive) {
                    this.isSelecting = true;
                    const selectionRect = this.add.rectangle(this.startX, this.startY, 0, 0, 0x000000, 0.2);
                    this.selectionRectangles.push(selectionRect);
                    this.currentRect = selectionRect;
                }
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging && movingRect) {
                movingRect.x = pointer.x + offsetX;
                movingRect.y = pointer.y + offsetY;
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
            movingRect = null;
            offsetX = 0;
            offsetY = 0;
        });
    }

    /**
     * Timer manager
    */
    secondCounter() { this.timer-- }

    /**
     * Load images after preload event
     *
     * @param {json} data - Get element for level and images
     */
    lazyLoadingImg(data, level){
        let loader = new Phaser.Loader.LoaderPlugin(this);

        loader.image(level, data);

        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            let img = this.add.sprite(400, 200, level);
            img.x = this.game.config.width/2
            img.y = this.game.config.height/2
        });

        loader.start();

        return loader
    }

    /**
     * Go to end scene
     */
    gameOver(){
        this.cache.json.remove('BE');
        this.loader.destroy()

        if(this.selectionRectangles){ this.selectionRectangles = [] }
        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene', {numLevel: this.level});
        });
    }
}