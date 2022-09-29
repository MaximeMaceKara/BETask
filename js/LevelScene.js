/**
 * Customizable game options
 */
 let gameOptions = {
    // Color of background
    bgColor1: 0xd1e6f9,
    bgColor2: 0x5596c0,
    bgColor3: 0x8aeb5e,
    bgColor4: 0x416e2d,
    bgColor5: 1,
  };

  /**
   * Level scene
   */
  export default class LevelScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
      super("LevelScene");
    }

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
      // Change background color
      var graphics = this.add.graphics();

      graphics.fillGradientStyle(gameOptions.bgColor1, gameOptions.bgColor2, gameOptions.bgColor3, gameOptions.bgColor4, gameOptions.bgColor5);
      graphics.fillRect(0, 0, this.game.config.width, this.game.config.height);

      let buttonLine = 1, // Width
      numLevel = 1; // Number of level
      // Create multiple Level Buttons on 3 height level
      for (let buttonHeight = 1; buttonHeight < 6; buttonHeight++) {
        // after making a line, start a new line on another height level
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
     * @param {int} buttonLine - allows you to determine the line where the button will be
     *
     * @param {int} buttonHeight - allows you to determine the height where the button will be
     *
     * @param {int} numLevel - allows you to determine the number of the level of the button will be
     */
    createButton(buttonLine, buttonHeight, numLevel) {
      let button = this.add.sprite(
        this.game.config.width /18 + this.game.scale.gameSize.width * 0.15 * buttonLine,
        this.game.scale.gameSize.height * 0.15 * buttonHeight,
        "btnEmpty"
      );

      button.setScale(1);

      button
        .setInteractive()
        .on("pointerdown", () => button.setScale(1.1))
        .on("pointerup", () => button.setScale(1));

      //number of the level on the button
      let nB = this.add.text(0, 0, numLevel).setOrigin(0, 0).setDepth(0);

      nB.setPadding(30);
      nB.setStyle({
        color: "#FFFFFF",
        fontSize: 30,
      });

      // Position of the number on button
      nB.x =  this.game.config.width /18 + this.game.scale.gameSize.width * 0.15 * buttonLine - nB.width / 2;
      nB.y = this.game.scale.gameSize.height * 0.15 * buttonHeight - nB.height / 2;

      // Start game when button down
      button.on("pointerup", () => this.goToGameScene(numLevel));
    }

    /**
     * Go to Game scene
     *
     * @param {int} numlevel -stock a choice of level number
     */
     goToGameScene(numlevel) {
      this.scene.start("GameScene", { numlevel: numlevel });
    }
  }