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
    titleText: 'Level ',

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

var alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
var solved;
var guess;
var guesses = [];
var chances= 3;
var lettersList = [];
var slotList = [];
var titleChances;

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
    init(data) {
        this.level = data.numlevel;
        this.jsonFile = `../levels/level${this.level}.json`;
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.spritesheet('cadre','assets/cadre.png',{
            frameWidth: 400,
            frameHeight: 400
        });

        alphabets.forEach((x) => this.load.svg(x,`assets/imgLetters/${x}.svg`, {scale: 3}));

        this.load.json("json", this.jsonFile);
    }

    /**
     * Create and init assets
     */
    create() {
        let data = this.cache.json.get('json');
        let selectedWord = data.wordFind;
        let self = this;

        solved = selectedWord.split('');

        this.lazyLoadingImg(data);

        // Change background color
        this.add.graphics()
            .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor2, 1)
            .fillRect(0, 0, this.game.config.width, this.game.config.height);

        // Level title
        let titleLevel = this.add.text(null, null, gameOptions.titleText + this.level, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.textFontSize,
            fill: gameOptions.titleColor,
        })

        titleLevel.x = 50;
        titleLevel.y = this.game.config.height * 0.04 - titleLevel.height / 2;

        titleChances = this.add.text(null,null,gameOptions.titleChance + chances, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.textFontSize,
            fill: gameOptions.titleColor
        })

        titleChances.x = this.game.config.width - titleChances.width - 50;
        titleChances.y = this.game.config.height * 0.04 - titleChances.height / 2;

        // Display answer slot
        this.addAnswerSlot();

        // Display letters
        this.addLetters();

        // Event manager
        this.input.on('drag',(pointer,gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            guesses[dropZone.name] = gameObject.name
            gameObject.input.enabled = false;
            dropZone.input.enabled = false;
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.x = (!dropped) ? gameObject.input.dragStartX: gameObject.x;
            gameObject.y = (!dropped) ? gameObject.input.dragStartY: gameObject.y;

            self.verifyWord(gameObject);
        });
    }

    /**
     *
     */
    addAnswerSlot() {
        // AnswerSlots dropzone
        let answerSlots = this.physics.add.staticGroup();

        solved.forEach((x,index) => {
            // Set name of image to Index of solved array
            this.answerSlots = answerSlots.create(this.game.config.width/ 3 +  gameOptions.answerSlotsSizeX * 0.15 * index,gameOptions.answerSlotsSizeY,'cadre')
                .setScale(.2)
                .setName(index)
                .setInteractive({dropZone: true});

            slotList.push(this.answerSlots);

            this.answerSlots.smoothed = false
        });
    }

    /**
     * Add letters to the board
     */
    addLetters(){
        let y = 450;
        let x = 750;

        // Shuffles the alphabets + adding solved to the alphabets
        alphabets = this.shuffle(alphabets);
        alphabets = this.shuffle(alphabets.concat(solved));

        alphabets.forEach((a) => {
            if (y > this.game.config.width*3/4){
                y = this.game.config.width/4;
                x += 100;
            }

            let sprite = this.add.image(y,x,a)
                .setScale(.5)
                .setInteractive()
                .setName(a);

            lettersList.push(sprite);

            this.input.setDraggable(sprite);

            y += 100;
        });
    }

    /**
     * Verify if word is valid
     */
    verifyWord(gameObject){
        // Verification of solved and guesses length
        if(solved.length == guesses.length && !guesses.includes(undefined)) {
            let solvedJoined = solved.join('');

            // Array to String
            guess = guesses.join('');

            // Verify two strings
            if(solvedJoined == guess){
                this.gameOver();
            } else{
                chances--;

                guesses.splice(guesses.indexOf(gameObject.name),1);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;

                this.reload();

                titleChances.text = gameOptions.titleChance + chances;

                // Display answer slot
                this.addAnswerSlot();

                // Display letters
                this.addLetters();

                if(chances < 1) this.gameOver();
            }
        }
    }

    /**
     * Load images after preload event
     *
     * @param {json} data - Get element for level and images
     */
     lazyLoadingImg(data){
        let loader = new Phaser.Loader.LoaderPlugin(this);

        for(let i=0; i< gameOptions.numberImages; i++){
            loader.image(data.images[i].key, data.images[i].url);
            gameOptions.images.push(data.images[i].key);
        }

        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            // 4 Images ( no images yet )
            let cadres = this.physics.add.staticGroup();
            cadres.create(
                    this.game.config.width/2 - gameOptions.imageSize * gameOptions.imageScale * 0.52,
                    this.game.config.height/5,gameOptions.images[0])
                .setScale(gameOptions.imageScale);

            cadres.create(this.game.config.width/2 + gameOptions.imageSize * gameOptions.imageScale * 0.52,
                    this.game.config.height/5,gameOptions.images[1])
                .setScale(gameOptions.imageScale);

            cadres.create(this.game.config.width/2 - gameOptions.imageSize * gameOptions.imageScale * 0.52,
                    this.game.config.height/2,gameOptions.images[2])
                .setScale(gameOptions.imageScale);

            cadres.create(this.game.config.width/2 + gameOptions.imageSize * gameOptions.imageScale * 0.52,
                    this.game.config.height/2,gameOptions.images[3])
                .setScale(gameOptions.imageScale);
        });

        loader.start();
    }

    /**
     * Shuffle the alphabets + solved
     *
     * @param {array} array
     *
     * @returns {array} array
     */
    shuffle(array) {
        // Shuffle Array
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    /**
     * Reload board
     */
    reload(){
        slotList.forEach((x) => x.destroy());
        lettersList.forEach((x) => x.destroy());
        guesses = [];
    }

    /**
     * Go to end scene
     */
    gameOver(){
        this.cache.json.destroy('json');

        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('EndScene',{ level: this.level, chances: chances });
        });
    }
}