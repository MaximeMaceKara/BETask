/**
 * Customizable game options
 */
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
    titleText: 'Level ',

    // Text Chances Left
    titleChance: 'Vies restants : ',

    // Image Size
    imageSize: 0.65,

    // answerSlots
    answerSlotsSizeX:650,
    answerSlotsSizeY:650,
}

var alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
var selectedWord = "COURIR";
var solved = selectedWord.split('');
var guess;
var guesses = [];
var level = 1;
var chances = 3;
var cadres;
var answerSlots;
var preload = true;
var titleMenu;
var titleChances;
var y = 450;
var x = 750;

/**
 * Class scene in game mode
 */
export default class GameScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('GameScene');
    }

    /**
     * Init the scene with data sent from another scene
     */
    init() {
        // TODO get data from last scene
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.spritesheet('backgroundImage','assets/backgroundImage.jpg',{
            frameWidth: 1920,
            frameHeight: 1080
        });

        this.load.spritesheet('cadre','assets/Cadre_blue.png',{
            frameWidth: 400,
            frameHeight: 400
        });

        alphabets.forEach((x) => {
            this.load.image(x,`assets/lettres_images/${x}.png`);
        });
    }

    /**
     * Create and init assets
     */
    create() {
        this.load.json('levelData', './assets/json/levels.json');

        let data = this.cache.json.get('levelData');

        this.add.image(950,450,'backgroundImage');

        // 4 Images ( no images yet )
        cadres = this.physics.add.staticGroup();
        cadres.create(700,150,'courir1').setScale(gameOptions.imageSize);
        cadres.create(700,450,'courir2').setScale(gameOptions.imageSize);
        cadres.create(1150,150,'courir3').setScale(gameOptions.imageSize);
        cadres.create(1150,450,'courir4').setScale(gameOptions.imageSize);

        // Level title
        titleMenu = this.add.text(null, null, gameOptions.titleText + level, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        })

        titleChances = this.add.text(null,null,gameOptions.titleChance + chances, {
                fontFamily: gameOptions.textFontFamily,
                fontStyle: gameOptions.textFontStyle,
                fontSize: gameOptions.titleFontSize,
                fill: gameOptions.titleColor
        })

        titleChances.x = this.game.config.width / 1.02 - titleChances.width / 1.02;
        titleChances.y = this.game.config.height * 0.04 - titleChances.height / 2;

        // AnswerSlots dropzone
        answerSlots = this.physics.add.staticGroup();

        solved.forEach((x,index) => {
            // Set name of image to Index of solved array
            this.answerSlots = answerSlots.create(gameOptions.answerSlotsSizeX,gameOptions.answerSlotsSizeY,'cadre')
                .setScale(.2)
                .setName(index)
                .setInteractive({dropZone: true});

            this.answerSlots.smoothed = false
            gameOptions.answerSlotsSizeX = gameOptions.answerSlotsSizeX + 100
        });

        // DropZone and drag inputs
        this.input.dragDistanceThreshold = 16;

        this.input.on('drag',(pointer,gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        }, this);

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            // Adding letter to guesses Array thx to Index of solved
            guesses[dropZone.name] = gameObject.name
            gameObject.input.enabled = false;
            dropZone.input.enabled = false;
        });

        self = this;

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.x = (!dropped) ? gameObject.input.dragStartX: gameObject.x;
            gameObject.y = (!dropped) ? gameObject.input.dragStartY: gameObject.y;

            // Verification of solved and guesses length
            if(solved.length == guesses.length && !guesses.includes(undefined)) {
                // Array to String
                guess = guesses.join('');
                var solved_joined = solved.join('');

                // Verify two strings
                if(solved_joined == guess){
                    if(level < 25){
                        guess = null
                        // Next lvl
                        level++
                        self.nextGame();
                    }
                    self.gameOver();
                }
                else{
                    chances--

                    guesses.splice(guesses.indexOf(gameObject.name),1);
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;

                    preload = false;

                    self.create();

                    if(chances < 1) self.gameOver();
                }
            }
        });

        self = this

        if(preload){
            // Shuffles the alphabets + adding solved to the alphabets
            alphabets = self.shuffle(alphabets);

            if(solved.length >= 6) alphabets = alphabets.slice(0,10)
            else alphabets = alphabets.slice(0,6)

            alphabets = self.shuffle(alphabets.concat(solved));
        }

        alphabets.forEach((a) => {
            if (y > 1250){
                y = 450;
                x = 850;
            }

            var sprite = this.add.image(y,x,a)
                .setScale(.5)
                .setInteractive()
                .setName(a);

            this.input.setDraggable(sprite);

            y = y + 100;
        });
    }

    /**
     * Manage game over context
     */
    nextGame() {
        this.scene.start('Scene2', { level: level, chances: chances });
    }

    /**
     * Update level
     */
    updateLevel() {
        guesses = [];
        titleMenu.setText(gameOptions.titleText + level);
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
        let currentIndex = array.length,  randomIndex;

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    /**
     * Go to end scene
     */
    gameOver(){
        this.scene.start('EndScene',{ level: level, chances: chances });
    }
}