import Player from '../sprites/Player.js';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.map = undefined;
        this.tiles = undefined;
        this.layer = undefined;
        this.player = undefined;
    }

    create()
    {
        this.cameras.main.setRoundPixels(true);

        // start controls
        this.controls.start();
        //this.controls.events.once('aup', () => {this.scene.start('level')}, this);

        // do setup stuff
        this.map = this.make.tilemap({ key: 'map' });
        this.tiles = this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createDynamicLayer(0, this.tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // only up collisions
        this.map.setCollisionBetween(65, 80);
        this.map.forEachTile(this.setCollisionOnlyUp, this, 0, 0, this.map.width, this.map.height);

        // all round collisions
        this.map.setCollisionBetween(129, 256);

        // animate the tiles
        this.sys.animatedTiles.init(this.map);
        this.sys.animatedTiles.setRate(0.65);

        this.player = new Player(this, 32, 32, 'player', 0);
        this.cameras.main.startFollow(this.player, true);
        this.physics.add.collider(this.player, this.layer);

        this.resizeField(this.sys.game.config.width, this.sys.game.config.height);
    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
    }

    resizeField(w, h)
    {

    }

    setCollisionOnlyUp(tile)
    {
        if (tile.index < 65 || tile.index > 80) {
            return;
        }
        tile.collideUp = true;
        tile.collideDown = false;
        tile.collideLeft = false;
        tile.collideRight = false;
    }
}

export default Level;
