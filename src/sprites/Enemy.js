class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setDepth(1);
        this.setSize(4, 12, true);
        this.setOffset(6, 4, true);
        this.setCollideWorldBounds(true);

        // tweak stuff
        this.speedMax = 60;
        this.speedChange = 10;

        // not tweakable
        this.facing = 'right';
        this.idle = false;
        this.jumpTimer = 0;
        this.speed = 0;
        this.ani = 'e-idle-left';
        this.controls = { left: false, right: true, jump: false };

        // game state
        this.alive = true;

        let anims = this.anims.animationManager;
        if (!anims.get('e-idle-left')) {
            anims.create({
                key: 'e-idle-left',
                frames: anims.generateFrameNumbers('enemy', { start: 5, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-idle-right')) {
            anims.create({
                key: 'e-idle-right',
                frames: anims.generateFrameNumbers('enemy', { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-run-left')) {
            anims.create({
                key: 'e-run-left',
                frames: anims.generateFrameNumbers('enemy', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-run-right')) {
            anims.create({
                key: 'e-run-right',
                frames: anims.generateFrameNumbers('enemy', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-jump-left')) {
            anims.create({
                key: 'e-jump-left',
                frames: anims.generateFrameNumbers('enemy', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-jump-right')) {
            anims.create({
                key: 'e-jump-right',
                frames: anims.generateFrameNumbers('enemy', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-flail-left')) {
            anims.create({
                key: 'e-flail-left',
                frames: anims.generateFrameNumbers('enemy', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('e-flail-right')) {
            anims.create({
                key: 'e-flail-right',
                frames: anims.generateFrameNumbers('enemy', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update(player, time, delta) {

        if (!this.alive) {
            return;
        }

        let touchedTile = this.scene.layer.getTileAtWorldXY(this.body.position.x, this.body.position.y);

        if (touchedTile.properties.acid) {
            this.acidDeath();
        }

        if (this.body.blocked.left) {
            this.controls.left = false;
            this.controls.right = true;
        }

        if (this.body.blocked.right) {
            this.controls.left = true;
            this.controls.right = false;
        }

        // movement

        this.body.velocity.x = 0;

        if (this.controls.left) {

            this.speed -= this.speedChange;
            this.speed = Math.max(this.speed, -this.speedMax);
            this.body.velocity.x = this.speed;

            this.facing = 'left';
            this.idle = false;

        } else if (this.controls.right) {

            this.speed += this.speedChange;
            this.speed = Math.min(this.speed, this.speedMax);
            this.body.velocity.x = this.speed;

            this.facing = 'right';
            this.idle = false;

        } else {

            this.speed += (0 - this.speed) / 2;
            this.body.velocity.x = this.speed;

            this.idle = true;

        }

        if (this.controls.jump && this.body.onFloor() && time > this.jumpTimer) {
            this.body.velocity.y = -136;
            this.jumpTimer = time + 250;
        }

        if (this.body.onFloor()) {

            if (this.idle) {

                if (this.facing === 'left') {
                    this.ani = 'e-idle-left';
                } else {
                    this.ani = 'e-idle-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'e-run-left';
                } else {
                    this.ani = 'e-run-right';
                }

            }

        } else {

            if (this.body.velocity.y < 0) {

                if (this.facing === 'left') {
                    this.ani = 'e-jump-left';
                } else {
                    this.ani = 'e-jump-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'e-flail-left';
                } else {
                    this.ani = 'e-flail-right';
                }

            }
        }

        // don't forget to animate :)
        this.anims.play(this.ani, true);

    }

    acidDeath()
    {
        this.alive = false;
        this.visible = false;
        this.body.enable = false;
        this.scene.emitter.explode(20, this.body.x, this.body.y + 8);
    }
}

export default Enemy;
