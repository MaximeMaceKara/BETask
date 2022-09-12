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
}

var alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
var selectedWord = "MANGER";
var solved = selectedWord.split('');
var guess;
var guesses = [];
var level = 2;
var cadres;
var answerSlots;
var titleMenu;

/**
 * Class scene in game mode
 */
export default class Scene2 extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('Scene2');
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
        this.load.spritesheet('Cadre','assets/Cadre_blue.png',{
            frameWidth: 400,
            frameHeight: 400
        });
        this.load.spritesheet('Eating1','assets/Level_Images/Level_2/eating1.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating2','assets/Level_Images/Level_2/eating2.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating3','assets/Level_Images/Level_2/eating3.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        this.load.spritesheet('Eating4','assets/Level_Images/Level_2/eating4.jpg',{
            frameWidth: 400,
            frameHeight: 400
        })
        // TODO MM: Try for loop to init images
        this.load.image('A','assets/lettres_images/A.png');
        this.load.image('B','assets/lettres_images/B.png');
        this.load.image('C','assets/lettres_images/C.png');
        this.load.image('D','assets/lettres_images/D.png');
        this.load.image('E','assets/lettres_images/E.png');
        this.load.image('F','assets/lettres_images/F.png');
        this.load.image('G','assets/lettres_images/G.png');
        this.load.image('H','assets/lettres_images/H.png');
        this.load.image('I','assets/lettres_images/I.png');
        this.load.image('J','assets/lettres_images/J.png');
        this.load.image('K','assets/lettres_images/K.png');
        this.load.image('L','assets/lettres_images/L.png');
        this.load.image('M','assets/lettres_images/M.png');
        this.load.image('N','assets/lettres_images/N.png');
        this.load.image('O','assets/lettres_images/O.png');
        this.load.image('P','assets/lettres_images/P.png');
        this.load.image('Q','assets/lettres_images/Q.png');
        this.load.image('R','assets/lettres_images/R.png');
        this.load.image('S','assets/lettres_images/S.png');
        this.load.image('T','assets/lettres_images/T.png');
        this.load.image('U','assets/lettres_images/U.png');
        this.load.image('V','assets/lettres_images/V.png');
        this.load.image('W','assets/lettres_images/W.png');
        this.load.image('X','assets/lettres_images/X.png');
        this.load.image('Y','assets/lettres_images/Y.png');
        this.load.image('Z','assets/lettres_images/Z.png');
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
        cadres.create(700,150,'Eating1').setScale(.65);
        cadres.create(700,450,'Eating2').setScale(.65);
        cadres.create(1150,150,'Eating3').setScale(.65);
        cadres.create(1150,450,'Eating4').setScale(.65);

        // Level title
        titleMenu = this.add.text(null, null, gameOptions.titleText + level, {
            fontFamily: gameOptions.textFontFamily,
            fontStyle: gameOptions.textFontStyle,
            fontSize: gameOptions.titleFontSize,
            fill: gameOptions.titleColor,
        })

        // AnswerSlots Dropzones
        answerSlots = this.physics.add.staticGroup();

        // TODO MM: Add in gameOptions
        var y = 650;
        var z = 650;

        solved.forEach((x,index)=>{
            // Set name of image to Index of solved array
            this.answerSlots = answerSlots.create(y,z,'Cadre').setScale(.2).setName(index).setInteractive({dropZone: true});
            this.answerSlots.smoothed = false
            y = y + 100
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
                    gameObject.input.enabled = true;
                    console.log(gameObject.name)
                }
            }


        });

        self = this
        // TODO MM: Game option
        var y = 450;
        var x = 750;

        // Shuffles the alphabets + adding solved to the alphabets
        alphabets = self.shuffle(alphabets);
        // TODO MM: GameOption
        alphabets = alphabets.slice(0,10)
        alphabets = self.shuffle(alphabets.concat(solved));

        // Places the buttons on the bottom of the screen
        alphabets.forEach((a)=>{
            if (y > 1250){
                y = 450;
                x = 850;
            }

            var sprite = this.add.image(y,x,a).setScale(.5).setInteractive().setName(a);
            this.input.setDraggable(sprite);
            y = y + 100;
            console.log(y)
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
        this.scene.start('Scene2');
    }

    /**
     *
     */
    updateLevel() {
        guesses = [];
        // TODO MM: Use an unique global variable
        alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
        console.log(alphabets,guesses);
        level++
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