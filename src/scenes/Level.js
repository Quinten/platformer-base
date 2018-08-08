import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';

class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.map = undefined;
        this.tiles = undefined;
        this.layer = undefined;
        this.player = undefined;
        this.emitter = undefined;
        this.particles = undefined;
        this.enemies = undefined;
        this.spawnpoints = [
            {"x": 992, "y": 992}
        ];
        this.gamepaused = undefined;
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
        this.map.setCollisionBetween(193, 256);

        // animate the tiles
        this.sys.animatedTiles.init(this.map);
        this.sys.animatedTiles.setRate(0.65);

        // the player
        this.player = new Player(this, 32, 992, 'player', 0);
        this.cameras.main.startFollow(this.player, true);
        this.physics.add.collider(this.player, this.layer);

        // the enemies
        this.enemies = [];
        for (let e = 0; e < this.spawnpoints.length; e++) {
            let spawnpoint = this.spawnpoints[e];
            let enemy = new Enemy(this, spawnpoint.x, spawnpoint.y, 'enemy', 0);
            this.physics.add.collider(enemy, this.layer);
            this.physics.add.collider(enemy, this.player, this.enemyPlayerCollide, undefined, this);
            this.enemies.push(enemy);
        }

        this.particles = this.add.particles('particles');
        this.emitter = this.particles.createEmitter({
            frame: [0, 1, 2, 3],
            x: 200,
            y: 300,
            speed: { min: 96, max: 160},
            angle: { min: 225, max: 315 },
            scale: { start: 2, end: 0 },
            lifespan: 1000,
            gravityY: 250,
            frequency: -1,
            rotate: { min: -540, max: 540 }
        });

        this.gamepaused = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'gamepaused');
        this.gamepaused.visible = false;
        this.gamepaused.setScrollFactor(0);

        this.resizeField(this.sys.game.config.width, this.sys.game.config.height);

        this.cameras.main.flash(3000, 255, 242, 230);
    }

    update(time, delta)
    {
        this.player.update(this.controls, time, delta);
        for (let e = 0; e < this.enemies.length; e++) {
            let enemy = this.enemies[e];
            enemy.update(this.player, time, delta);
        }
    }

    resizeField(w, h)
    {
        this.gamepaused.x = w / 2;
        this.gamepaused.y = h / 2;
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

    restartLevel()
    {
        this.cameras.main.once('camerafadeoutcomplete', (camera) => {
            this.scene.restart();
        }, this);
        this.cameras.main.fadeOut(3000, 255, 242, 230);
    }

    enemyPlayerCollide(enemy, player)
    {
        if (enemy.alive && player.alive) {
            if (enemy.body.touching.up) {
                enemy.playerDeath();
            } else {
                player.acidDeath();
            }
        }

        if (player.alive && enemy.body.touching.up) {
            player.body.velocity.y = -player.jumpPower;
            enemy.playerHit();
        }
    }

    onGamePause()
    {
        this.gamepaused.visible = true;
    }

    onGameResume()
    {
        this.gamepaused.visible = false;
    }
}

export default Level;
