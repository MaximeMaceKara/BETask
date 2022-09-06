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
    titleText: '4 IMAGES 1 MOT',
    btnText: 'Jouer',
}
// Variables
var alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ];
var words = ["APPLE","POMME","JOE","MOPE","SLOPER"];
var selectedWord = Math.floor(Math.random() * words.length);
var guess;
var guesses = [];
var categories;
/**
 * Class scene in game mode
 */
var cadres;
var answerSlots;
var lettersImages;

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
        this.load.spritesheet('Cadre','assets/Cadre_blue.png',{
            frameWidth: 400,
            frameHeight: 400
        });
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
        this.load.image('Correct','assets/correct.png');
        this.load.image('Incorrect','assets/incorrect.png');
    }

    /**
     * Create and init assets
     */
    create() {
        // TODO init game object
        this.add.image(950,450,'backgroundImage');
        cadres = this.physics.add.staticGroup();
        cadres.create(700,150,'Cadre').setScale(.65);
        cadres.create(700,450,'Cadre').setScale(.65);
        cadres.create(1150,150,'Cadre').setScale(.65);
        cadres.create(1150,450,'Cadre').setScale(.65);

        answerSlots = this.physics.add.staticGroup();
        var y = 650;
        var z = 650
        words.forEach((x)=>{
            if(x == words[selectedWord]){
                for (var i = 0; i < x.length; i++){
                    var sprite = answerSlots.create(y,z,'Cadre').setScale(.2);
                    for (var e = 0; e < guesses.length; e++){
                        if(x[i] !== guesses[e]){
                            sprite = answerSlots.create(y,z,'Cadre').setScale(.2);
                        }
                        else{
                            sprite.setTexture(x[i]).setScale(.5);

                        }
                    }

                    sprite.smoothed = false;
                    y = y  + 100;
                }
            }
        })



        lettersImages = this.physics.add.staticGroup();
        var y = 350;
        var x = 750;
        var delay = 2000;
        alphabets.forEach((a)=>{
            if (y > 1550){
                y = 350;
                x = 850;
            }
            var sprite = lettersImages.create(y,x,a).setScale(.5).setInteractive();
            // sprite.smoothed = false;
            console.log(words[selectedWord])
            sprite.on('pointerdown',(pointer)=>{
                console.log(a)
                if(words[selectedWord].indexOf(a) > -1){
                    sprite.setTexture('Incorrect');
                    guesses.push(a)
                    this.create();
                    console.log(guesses)
                    this.time.addEvent({
                        delay: delay,
                        callback: () => {
                            sprite.visible = false;
                        }
                    })
                }
                else{
                    sprite.setTexture('Correct');
                }

            });
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

    gameOver() {
        // Go to end scene
        this.scene.start('EndScene');
    }
}