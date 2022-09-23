import EndScene from './EndScene.js';
import GameScene from './GameScene.js';
import Scene2 from './Scene2.js';
import Scene3 from './Scene3.js';
import Scene4 from './Scene4.js';
import Scene5 from './Scene5.js';
import Scene6 from './Scene6.js';
import Scene7 from './Scene7.js';
import Scene8 from './Scene8.js';
import Scene9 from './Scene9.js';
import Scene10 from './Scene10.js';
import Scene11 from './Scene11.js';
import Scene12 from './Scene12.js';
import Scene13 from './Scene13.js';
import Scene14 from './Scene14.js';
import Scene15 from './Scene15.js';
import Scene16 from './Scene16.js';
import Scene17 from './Scene17.js';
import Scene18 from './Scene18.js';
import Scene19 from './Scene19.js';
import Scene20 from './Scene20.js';
import Scene21 from './Scene21.js';
import Scene22 from './Scene22.js';
import Scene23 from './Scene23.js';
import Scene24 from './Scene24.js';
import Scene25 from './Scene25.js';
import StartScene from './StartScene.js';

/**
 * Configuration of the game
 */
const configurations = {
    type: Phaser.AUTO,
    backgroundColor: '#FFFFFF',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 900,
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debut: true,
        },
    },
    scene: [GameScene,StartScene,Scene2,Scene3,Scene4,Scene5,Scene6,Scene7,Scene8,Scene9,Scene10,Scene11,Scene12,Scene13,Scene14,Scene15,Scene16,Scene17,Scene18,Scene19,Scene20,Scene21,Scene22,Scene23,Scene24,Scene25,EndScene],
};

/**
 * The main controller for the entire Phaser game.
 *
 * @name game
 * @type {object}
 */
new Phaser.Game(configurations);