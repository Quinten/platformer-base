class Preloader extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'preloader' });
    }

    preload ()
    {
        // just a preload bar in graphics
        let progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xe5ffff, 1);
            progress.fillRect(0, (this.sys.game.config.height / 2) - 30, this.sys.game.config.width * value, 60);
        });
        this.load.on('complete', () => {
            progress.destroy();
        });

        // Load assets here
        // ...
        this.load.image('tiles', 'assets/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('particles', 'assets/particles.png', { frameWidth: 4, frameHeight: 4 });
        this.load.image('gamepaused', 'assets/gamepaused.png');
    }

    create ()
    {
        this.scene.start('level');
    }

}

export default Preloader;
