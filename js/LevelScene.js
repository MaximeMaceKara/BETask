/**
 * Customizable game options
 */
 let gameOptions = {
    // Color of background
    bgColor1: 0x414141,
    bgColor2: 0x000000,

    btnTintColor: 0x9E9E9E,
  };

  /**
   * Level scene
   */
  export default class LevelScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() { super("LevelScene") }

    /**
     * Load the game assets.
     */
    preload() {
      // Load image
      this.load.svg("btnEmpty", "assets/btn/btnEmpty.svg", { scale: 1.2 });
    }

    /**
     * Create and init game assets
     */
    create() {
      let buttonLine = 1, numLevel = 1;

      // Change background color
      this.add.graphics()
        .fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor2, 1)
        .fillRect(0, 0, this.game.config.width, this.game.config.height);

      // Create multiple Level Buttons on 3 height level
      for (let buttonHeight = 1; buttonHeight < 6; buttonHeight++) {
        // After making a line, start a new line on another height level
        buttonLine = 1;

        // As long as the line isn't completed continue
        while (buttonLine <= 5) {
          this.createButton(buttonLine, buttonHeight, numLevel);
          buttonLine++;
          numLevel++;
        }
      }
    }

    /**
     * Create Level Button
     *
     * @param {int} buttonLine - Allows you to determine the line where the button will be
     *
     * @param {int} buttonHeight - Allows you to determine the height where the button will be
     *
     * @param {int} numLevel - Allows you to determine the number of the level of the button will be
     */
    createButton(buttonLine, buttonHeight, numLevel) {
      let btn = this.add.sprite(this.game.config.width / 18 + this.game.scale.gameSize.width * 0.15 * buttonLine,
        this.game.scale.gameSize.height * 0.15 * buttonHeight,
        "btnEmpty")
        .setScale(1)
        .setInteractive()
        .on('pointerover', () => { btn.setTint(gameOptions.btnTintColor) })
        .on('pointerout', () => { btn.clearTint() })
        .on('pointerdown', () => this.goToGameScene(numLevel));

      // Number of the level on the button
      let nB = this.add.text(0, 0, numLevel)
        .setOrigin(0, 0)
        .setDepth(0)
        .setPadding(30)
        .setStyle({ color: "#FFFFFF", fontSize: 30 });

      // Position of the number on button
      nB.x =  this.game.config.width / 18 + this.game.scale.gameSize.width * 0.15 * buttonLine - nB.width / 2;
      nB.y = this.game.scale.gameSize.height * 0.15 * buttonHeight - nB.height / 2;
    }

    /**
     * Go to Game scene
     *
     * @param {int} numlevel - Stock a choice of level number
     */
     goToGameScene(numlevel) {
      // Fade out animation
      this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start("GameScene", { numlevel: numlevel });
      });
    }
  }