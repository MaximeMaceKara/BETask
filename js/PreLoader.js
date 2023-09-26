
/**
 * Class preloader which load every assets before scene
 */
export default class PreLoader extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
      super('PreLoader');
    }

    /**
     * Level button data
     *
     * @param {int} data - Allows you to determine the chosen level
     *
     */
    init(data) {
        this.level = data.numLevel;
    }

    /**
     * Load the game assets
     */
    preload() {
      // Fonts
      this.loadFont('Monogram',  '/assets/font/monogram_extended.ttf');
      this.loadFont('Arcadia',  '/assets/font/Arcadia-Regular.ttf');

      // Images
      this.load.image('background', '/assets/background/Background 1.png');
      this.load.image('bgTree_1', '/assets/background/BGTrees 2.png');
      this.load.image('lights_1', '/assets/background/Lights 3.png');
      this.load.image('lights_2', '/assets/background/Lights 6.png');
      this.load.image('bgTree_2', '/assets/background/BGTrees 4.png');
      this.load.image('bgTree_3', '/assets/background/BGTrees 5.png');
      this.load.image('bgTree_4', '/assets/background/BGTrees 7.png');
      this.load.image('upTree', '/assets/background/UpTrees 8.png');
      this.load.image('floor', '/assets/background/Floor 9.png');
      this.load.image('spike', '/assets/obstacle/spike collection.png');

      // Sprite sheets
      this.load.spritesheet('player', '/assets/player/player_run.png', {
        frameWidth: 63.5,
        frameHeight: 59,
      });

      this.load.spritesheet('player_rest', '/assets/player/player_rest.png', {
        frameWidth: 33.7,
        frameHeight: 60,
      });

      this.load.spritesheet('player_jump', '/assets/player/player_jump.png', {
        frameWidth: 56.7,
        frameHeight: 59,
      });

      this.load.spritesheet('player_falling', '/assets/player/player_falling.png', {
        frameWidth: 51.91,
        frameHeight: 59,
      });

      this.load.spritesheet('player_dead', '/assets/player/player_dead.png', {
        frameWidth: 73,
        frameHeight: 60,
      });

      this.load.spritesheet('skeleton_walk', '/assets/monsters/skeleton/Skeleton Walk.png', {
        frameWidth: 45.4,
        frameHeight: 68,
      });

      this.load.audio('gameMusic', '/assets/music/A mystical journey_3.ogg');
      this.load.audio('death_sound', '/assets/sound_effects/death_4_alex.wav');

      console.log("PreLoader preload");
    }

    create() {
        console.log("PreLoader");
        // Animations
        this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', {
            start: 0,
            end: 5,
        }),
        frameRate: 10,
        repeat: -1,
        });

        this.anims.create({
        key: 'dead',
        frames: this.anims.generateFrameNumbers('player_dead', {
            start: 0,
            end: 4,
        }),
        frameRate: 4,
        });

        this.anims.create({
        key: 'rest',
        frames: this.anims.generateFrameNumbers('player_rest', {
            start: 0,
            end: 2,
        }),
        frameRate: 2,
        repeat: -1,
        });

        this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player_jump', {
            start: 0,
            end: 6,
        }),
        frameRate: 8,
        });

        this.anims.create({
        key: 'falling',
        frames: this.anims.generateFrameNumbers('player_falling', {
            start: 0,
            end: 5,
        }),
        frameRate: 7,
        });

        this.anims.create({
        key: 'skeleton_walking',
        frames: this.anims.generateFrameNumbers('skeleton_walk', {
            start: 0,
            end: 12,
        }),
        frameRate: 10,
        repeat: -1,
        });

        // Loading Game scene
        this.scene.start('PlayScene', { numLevel: this.level, timeDone:0});
    }

    /**
     * Load fonts for Phaser
     *
     * @param {*} name
     * @param {*} url
     */
    loadFont(name, url) {
      var newFont = new FontFace(name, `url(${url})`);

      newFont.load().then(function (loaded) {
          document.fonts.add(loaded);
      }).catch(function (error) {
          console.log(error);
      });
    }
  }
