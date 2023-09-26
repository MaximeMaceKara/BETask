/**
 * Customizable game options
 */
let gameOptions = {
    delay: 1000,

    drop: 1,
    dropForce: 150,
  
    platformSpeed: 300,
  
    // Player
    playerGravity: 900,
    jumpForce: 500,
    playerPositionX: 200,
    playerPositionY: 629,
    jumps: 2,
  
    // Score
    scoreSpeed: 500,
  
    // Moving obstacles
    skeletonSpawnRate: 6000,
  
    // Obstacles
    spikeWidth: 56,
    spikeScaleRange: [1, 4],
    spikePercent: 25,
    spikeSpawnRate: 10000,
}

var isOver = false;

/**
 * Class scene in game mode
 */
export default class PlayScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() { super('PlayScene') }

    /**
     * Level button data
     *
     * @param {int} data - Allows you to determine the chosen level
     *
     */
    init(data) {
        this.level = data.numLevel + 1;
        this.timeDone = data.timeDone;
        console.log(this.timeDone)
    }

    /**
     * Load the game assets.
     */
    preload() {
        this.load.json('PlayScene', `../levels/level${this.level}.json`);
        this.width = this.scale.width;
        this.height = this.scale.height;
    }

    /**
     * Create and init assets
     */
    create() {
        console.log("PlayScene");

        let jsonData = this.cache.json.get('PlayScene');
        isOver=false;

        // Instantiate timer and display
        this.timer = this.time.addEvent({
            delay: gameOptions.delay,
            callback: this.secondCounter,
            callbackScope: this,
            loop: true,
        });

        this.timer = jsonData.timer - this.timeDone;

        this.chronoText = this.add.text(null, null, this.timer, {
            fontSize: gameOptions.textFontSize,
            fill: gameOptions.countDownTextColor,
        });

        this.chronoText.setDepth(1);
        this.chronoText.x = this.game.config.width - 100;
        this.chronoText.y = this.game.config.height * 0.08 - this.chronoText.height / 2;

        //// GAME MANAGE
        // Add ambient music
        this.gameMusic = this.sound.add('gameMusic', { volume: 0.25, loop: true });
        this.gameMusic.play();

        // Init data
        this.alive = true;
        this.skeletonAlive = true;
        this.playerJumps = 0;
        this.playerDrops = 0;
        this.spikeAdded = 0;
        this.score = 0;
        this.scoreSpeed = gameOptions.scoreSpeed;

        // Add parallax background
        const bgh = this.textures.get('background').getSourceImage().height;

        this.add.tileSprite(0, this.height, this.width, bgh, 'background')
        .setOrigin(0, 1);

        this.bg1 = this.createAligned(this, -23, 'bgTree_1', true);
        this.bg2 = this.createAligned(this, 100, 'lights_1', false);
        this.bg3 = this.createAligned(this, -53, 'bgTree_2', true);
        this.bg4 = this.createAligned(this, -75, 'bgTree_3', true);
        this.bg5 = this.createAligned(this, 100, 'lights_2', false);
        this.bg6 = this.createAligned(this, -45, 'bgTree_4', true);
        this.bg7 = this.createAligned(this, 0, 'upTree', true);
        this.bg8 = this.createAligned(this, 10, 'floor', true, -250);
        this.bg8 = this.physics.add.existing(this.bg8);
        this.bg8.body.setImmovable();
        this.bg8.body.setSize(this.width, 55);

        // Score text
        this.scoreText = this.make.text({
        x: this.width - 160,
        y: 40,
        text: 'SCORE: 0',
        style: {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arcadia, monospace',
        },
        });

        // Score related by time
        this.scoreCounter = this.time.addEvent({
        delay: this.scoreSpeed,
        callback: () => {
            this.score += 1;
        },
        callbackScope: this,
        loop: true,
        });

        // Create player object
        this.player = this.physics.add.sprite(gameOptions.playerPositionX, this.height, 'player');
        this.player.setGravityY(gameOptions.playerGravity);

        this.physics.add.collider(this.player, this.bg8, () => {
        this.platformTouching = false;
        if (!this.player.anims.isPlaying && this.alive) {
            this.player.setTexture('player');
            this.player.anims.play('run', true);
        }
        });

        this.physics.add.overlap(this.player, this.bg8, () => {
        this.player.setPosition(200, this.height - 104);
        });

        // Game manager
        const keys = this.input.keyboard.addKeys({
        space: 'SPACE',
        a: 'A',
        s: 'S',
        w: 'W',
        });

        keys.space.on('down', this.jump, this);
        keys.w.on('down', this.jump, this);
        keys.s.on('down', this.instaDrop, this);

        this.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown()) {
            this.instaDrop();
        }
        }, this);

        // Obstacles adding
        this.spikeGroup = this.add.group({
        removeCallback: (spike) => {
            spike.scene.spikePool.add(spike);
        },
        });

        this.spikePool = this.add.group({
        removeCallback: (spike) => {
            spike.scene.spikeGroup.add(spike);
        },
        });

        this.spikeCollider = this.physics.add.collider(this.player, this.spikeGroup, () => {
        this.alive = false;
        this.player.setTexture('player_dead');
        this.player.anims.play('dead', true);
        this.sound.play('death_sound', { volume: 0.25 });
        this.player.body.setVelocityY(-200);

        this.outro();
        }, null, this);

        this.spikeFloor = this.time.addEvent({
        delay: gameOptions.spikeSpawnRate,
        callback: () => {
            this.spawnSpike();
        },
        callbackScope: this,
        loop: true,
        });

        this.floorSpikeGroup = this.add.group();

        this.floorSpikeCollider = this.physics.add.collider(this.player, this.floorSpikeGroup, () => {
        this.alive = false;
        this.player.setTexture('player_dead');
        this.player.anims.play('dead', true);
        this.sound.play('death_sound', { volume: 0.25 });
        this.player.body.setVelocityY(-200);

        this.outro();
        }, null, this);

        // Moving obstacles
        this.skeletonSpawner = this.time.addEvent({
        delay: gameOptions.skeletonSpawnRate,
        callback: () => {
            this.spawnSkeleton();
        },
        callbackScope: this,
        loop: true,
        });

        this.skeletonGroup = this.add.group();

        this.skeletonCollider = this.physics.add.collider(this.player, this.skeletonGroup, () => {
        if (this.alive && this.skeletonAlive) {
            this.alive = false;
            this.player.setTexture('player_dead');
            this.player.anims.play('dead', true);
            this.sound.play('death_sound', { volume: 0.25 });
            this.player.body.setVelocityY(-200);

            this.outro();
        }
        }, null, this);
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

        //// GAME MANAGE
        this.player.x = gameOptions.playerPositionX;
        this.player.setVelocityX(0);

        if (this.alive) {
          this.backgroundParallax();

          this.scoreText.setText(`SCORE: ${this.score}`);

          this.scoreText.x = this.width - this.scoreText.width - 50;

          this.objectRemove();

        } else {
          this.theAfterLife();
        }
    }

    /**
     * Get jumping action
     */
    jump() {
        if ((this.alive) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
        if (this.player.body.touching.down) {
            this.playerJumps = 0;
        }

        this.player.setVelocityY(gameOptions.jumpForce * -1);
        this.player.anims.play('jump', true);
        this.playerJumps += 1;
        }
    }

    /**
     * Get double jump
     */
    instaDrop() {
        if ((this.alive) && (!this.player.body.touching.down || (this.playerDrops > 0 && this.playerJumps < gameOptions.drops))) {
        if (this.player.body.touching.down) {
            this.playerDrops = 0;
        }
        this.player.setVelocityY(gameOptions.dropForce);
        this.playerDrops += 1;
        }
    }

    /**
     * Spawn obstacle
     */
    spawnSpike() {
        this.spikeAdded += 1;
        const h = this.textures.get('spike').getSourceImage().height;

        const floorSpike = this.add.tileSprite(this.width, this.height - 104, gameOptions.spikeWidth * Phaser.Math.Between(gameOptions.spikeScaleRange[0], gameOptions.spikeScaleRange[1]), h, 'spike');

        this.physics.add.existing(floorSpike);
        floorSpike.body.setImmovable();
        floorSpike.body.setVelocityX(gameOptions.platformSpeed * -1);
        this.floorSpikeGroup.add(floorSpike);
    }

    /**
     * Spawn moving obstacle
     */
    spawnSkeleton() {
        this.skeletonAlive = true;

        const skeleton = this.physics.add.sprite(this.width, this.height - 104, 'skeleton_walk');

        skeleton.setVelocityX(gameOptions.platformSpeed * -1 - 50);
        skeleton.anims.playReverse('skeleton_walking');
        skeleton.setImmovable();

        this.skeletonGroup.add(skeleton);
    }

    /**
     * Get background moving
     */
    backgroundParallax() {
        if (this.player.body.velocity.y > 0 && !this.player.anims.isPlaying) {
        this.player.anims.play('falling', true);
        }
        const bgs = [this.bg1, this.bg2, this.bg3, this.bg4, this.bg5, this.bg6, this.bg7, this.bg8];
        const fact = [1.45, 1.5, 1.65, 1.75, 1.85, 2.1, 3.55, 5.1];

        bgs.forEach((bg, index) => {
        bg.tilePositionX += fact[index];
        });
    }

    /**
     * Remove obstacle
     */
    objectRemove() {
        this.spikeGroup.getChildren().forEach(spike => {
        if (spike.x < -spike.displayWidth / 2) {
            this.spikeGroup.killAndHide(spike);
            this.spikeGroup.remove(spike);
        }
        }, this);

        this.floorSpikeGroup.getChildren().forEach(spike => {
        if (spike.x < -spike.displayWidth / 2) {
            this.floorSpikeGroup.remove(spike);
            spike.destroy();
        }
        }, this);

        this.skeletonGroup.getChildren().forEach(skeleton => {
        if (skeleton.x < -skeleton.displayWidth / 2) {;
            this.skeletonGroup.remove(skeleton);
            skeleton.destroy();
        }
        }, this);
    }

    /**
     * Get game over actions
     */
    theAfterLife() {
        this.gameMusic.stop();

        this.scoreCounter.paused = true;
        this.skeletonSpawner.paused = true;
        this.spikeFloor.paused = true;

        this.spikeGroup.getChildren().forEach(spike => {
        spike.setVelocityX(0);
        });

        this.floorSpikeGroup.getChildren().forEach(spike => {
        spike.body.setVelocityX(0);
        });

        this.skeletonGroup.getChildren().forEach(skeleton => {
        skeleton.body.setVelocityX(-50);
        });

        this.input.keyboard.removeAllKeys();

        this.physics.world.removeCollider(this.spikeCollider);
        this.physics.world.removeCollider(this.floorSpikeCollider);
        this.physics.world.removeCollider(this.skeletonCollider);
        this.physics.world.removeCollider(this.skeletonOverlap);

        this.time.delayedCall(1000, () => {
        this.player.setTexture('player_dead', 4);
        });
    }

    /**
     * Go to end Scene
     */
    outro() {
        this.time.delayedCall(3000, () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        console.log(this.timeDone)

        if(this.timer <= 0){
            isOver = true
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('GameScene', {numLevel: this.level});
            });
        } else {
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('PlayScene', {numLevel: this.level - 1, timeDone: this.timeDone});
            });
        }
    }

    /**
     * do not know
     *
     * @param {*} scene
     * @param {*} heightDiff
     * @param {*} image
     * @param {*} origin
     * @param {*} widthDiff
     * @returns
     */
    createAligned (scene, heightDiff, image, origin, widthDiff = 0) {
        let x = 0;
        let l = scene.scale.width / 2;
        let m;
        const h = scene.textures.get(image).getSourceImage().height;
        if (image === 'upTree') {
        m = scene.add.tileSprite(x, 0 + heightDiff, scene.scale.width, h, image)
            .setOrigin(0, 0);

        x += m.width;
        } else if (origin === true && image !== 'upTree') {
        m = scene.add.tileSprite(x, scene.scale.height + heightDiff, scene.scale.width, h, image)
            .setOrigin(0, 1);

        x += m.width;
        } else {
        const posY = scene.scale.height / 2 + heightDiff;
        m = scene.add.tileSprite(l + widthDiff, posY, scene.scale.width, h, image);

        l += m.width;
        }

        return m;
    };

    /**
     * Timer manager
    */
    secondCounter() {
        this.timer--;
        this.timeDone ++;
    }

    /**
     * Go to end scene
     */
    gameOver(){
        this.cache.json.remove('PlayScene');

        // Fade out animation
        this.cameras.main.fadeOut(gameOptions.animFadeSpeed, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene', {numLevel: this.level});
        });
    }
}