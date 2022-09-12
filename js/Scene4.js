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


    // Image Size
    imageSize: 0.65,

   // answerSlots 
    answerSlotsSizeX:650,
    answerSlotsSizeY:650
}

var alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
var selectedWord = "MANGER";
var solved = selectedWord.split('');
var guess;
var guesses = [];
var level;
var cadres;
var answerSlots;
var preload = true;
var titleMenu;

/**
 * Class scene in game mode
 */
export default class Scene4 extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('Scene4');
    }

    /**
     * Init the scene with data sent from another scene
     */
    // TODO get data from last scene
    init(data) { this.data = data}


    /**
     * Load the game assets.
     */
    preload() {
        this.load.spritesheet('backgroundImage','assets/backgroundImage.jpg',{
            frameWidth: 1920,
            frameHeight: 1080
        });
        this.load.spritesheet('Cadre','assets/Cadre_blue.png',{
            frameWidth: 400,
            frameHeight: 400
        });
        this.load.spritesheet('Eating1','assets/Level_Images/Level_2/eating1ff.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating2','assets/Level_Images/Level_2/eating2ff.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating3','assets/Level_Images/Level_2/eating3ff.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating4','assets/Level_Images/Level_2/eating4ff.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        // TODO MM: Try for loop to init images
        alphabets.forEach((x)=>{
            this.load.image(x,`assets/lettres_images/${x}.png`);
        });
        // @WIP MM
        // this.load.image('Correct','assets/correct.png');
        // this.load.image('Incorrect','assets/incorrect.png');
    }

    /**
     * Create and init assets
     */
    create() {
        this.add.image(950,450,'backgroundImage');

        // TODO MM: .65 needs to be a gameOptions
        // 4 Images ( no images yet )
        cadres = this.physics.add.staticGroup();
        cadres.create(700,150,'Eating1').setScale(gameOptions.imageSize);
        cadres.create(700,450,'Eating2').setScale(gameOptions.imageSize);
        cadres.create(1150,150,'Eating3').setScale(gameOptions.imageSize);
        cadres.create(1150,450,'Eating4').setScale(gameOptions.imageSize);

        // Level title
        titleMenu = this.add.text(null, null, gameOptions.titleText + this.data.level, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        })

        // AnswerSlots Dropzones
        answerSlots = this.physics.add.staticGroup();

        // TODO MM: Add in gameOptions


        solved.forEach((x,index)=>{
            // Set name of image to Index of solved array
            this.answerSlots = answerSlots.create(gameOptions.answerSlotsSizeX,gameOptions.answerSlotsSizeY,'Cadre').setScale(.2).setName(index).setInteractive({dropZone: true});
            this.answerSlots.smoothed = false
            gameOptions.answerSlotsSizeX = gameOptions.answerSlotsSizeX + 100       
 });

        // DropZone and Drag Inputs
        // TODO MM: Add to gameOption
        this.input.dragDistanceThreshold = 16;
            this.input.on('drag',(pointer,gameObject, dragX, dragY)=>{
                gameObject.x = dragX;
                gameObject.y = dragY;

            });

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
        }, this);


        this.input.on('drop', function (pointer, gameObject, dropZone) {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            // Adding letter to guesses Array thx to Index of solved
            guesses[dropZone.name] = gameObject.name
            gameObject.input.enabled = false;
            dropZone.input.enabled = false;
        });

        self = this;

        this.input.on('dragend', function (pointer, gameObject, dropped) {

            if (!dropped)
            {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

            // Verification of solved and guesses length
            if(solved.length == guesses.length && !guesses.includes(undefined))
            {
                // Array to String
                guess = guesses.join('');
                var solved_joined = solved.join('');

                // Verify two strings
                if(solved_joined == guess){
                    guess = null
                    // Next lvl
                    self.nextGame();
                }
                else{
                    // WIP WIP WIP
                    console.log("Fail");
                    // self.answerSlots.disableBody(true,true)
                    guesses.splice(guesses.indexOf(gameObject.name),1);
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                    preload = false;
                    self.create();
                    console.log(alphabets);
                }
            }


        });

        self = this
        // TODO MM: Game option
        var y = 450;
        var x = 750;

        if(preload){
            // Shuffles the alphabets + adding solved to the alphabets
            alphabets = self.shuffle(alphabets);
            // TODO MM: GameOption
            if(solved.length >= 6){
                alphabets = alphabets.slice(0,10)
            }
            else {
                alphabets = alphabets.slice(0,6)
            }
            alphabets = self.shuffle(alphabets.concat(solved));

            // Places the buttons on the bottom of the screen
        }
        alphabets.forEach((a)=>{
            if (y > 1250){
                y = 450;
                x = 850;
            }

            var sprite = this.add.image(y,x,a).setScale(.5).setInteractive().setName(a);
            this.input.setDraggable(sprite);
            y = y + 100;
        });
    }

    /**
     * Update the scene frame by frame
     */
    update() {
        // TODO update loop cycle
    }

    /**
     * Manage game over context
     */
    nextGame() {
        level = this.data.level
        level++
        this.scene.start('Scene5',{
            level: level
        });
    }

    /**
     *
     */
     updateLevel() {
        guesses = [];
        // TODO MM: Use an unique global variable
        titleMenu.setText(gameOptions.titleText + level);
    }

    /**
     * Shuffle the alphabets + solved
     *
     * @param {array} array - ???
     *
     * @returns {array} array - ???
     */
    shuffle(array) {
        // Shuffle Array
        let currentIndex = array.length,  randomIndex;

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}

