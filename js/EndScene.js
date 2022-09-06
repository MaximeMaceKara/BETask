/**
 * Class scene in end view
 */
export default class EndScene extends Phaser.Scene {
    /**
     * Constructor
     */
    constructor() {
        super('EndScene');
    }

    /**
     * Init the scene with data sent in another scene
     */
    init() {
        // TODO get data from last scene
    }

    /**
     * Load the game assets.
     */
    preload() {
        // TODO Load assets
    }

    /**
     * Create and init assets
     */
    create() {
        // TODO init game object
    }

    /**
     * Go to Main scene
     */
    goToStartScene() {
        this.scene.start('StartScene');
    }
}