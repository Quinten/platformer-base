class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setDepth(1);
        this.setSize(4, 8, true);
        this.setOffset(6, 8, true);
        this.setCollideWorldBounds(true);

        // tweak stuff
        this.speedMax = 65;
        this.speedChange = 10;

        // not tweakable
        this.facing = 'right';
        this.idle = false;
        this.jumpTimer = 0;
        this.speed = 0;
        this.ani = 'idle-left'

        let anims = this.anims.animationManager;
        if (!anims.get('idle-left')) {
            anims.create({
                key: 'idle-left',
                frames: anims.generateFrameNumbers('player', { start: 5, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('idle-right')) {
            anims.create({
                key: 'idle-right',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-left')) {
            anims.create({
                key: 'run-left',
                frames: anims.generateFrameNumbers('player', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('run-right')) {
            anims.create({
                key: 'run-right',
                frames: anims.generateFrameNumbers('player', { start: 1, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('jump-left')) {
            anims.create({
                key: 'jump-left',
                frames: anims.generateFrameNumbers('player', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('jump-right')) {
            anims.create({
                key: 'jump-right',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('flail-left')) {
            anims.create({
                key: 'flail-left',
                frames: anims.generateFrameNumbers('player', { start: 9, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.get('flail-right')) {
            anims.create({
                key: 'flail-right',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    update(controls, time, delta) {

        /*
        //this.player.body.setVelocity(0);
        let oldSpeedX = this.body.velocity.x;
        let oldSpeedY = this.body.velocity.y;
        this.body.setVelocityX(Math.min(oldSpeedX + this.speedIncrement, Math.max(oldSpeedX - this.speedIncrement, 0)));
        this.body.setVelocityY(Math.min(oldSpeedY + this.speedIncrement, Math.max(oldSpeedY - this.speedIncrement, 0)));

        let targetAnim = '';

        if (controls.left) {
            this.body.setVelocityX(Math.max(oldSpeedX - this.speedIncrement, -this.maxSpeed));
            targetAnim = 'player-left';
        } else if (controls.right) {
            this.body.setVelocityX(Math.min(oldSpeedX + this.speedIncrement, this.maxSpeed));
            this.aim = 0;
            targetAnim = 'player-right';
        }

        if (controls.up) {
            this.body.setVelocityY(Math.max(oldSpeedY - this.speedIncrement, -this.maxSpeed));
            targetAnim = 'player-up';
        } else if (controls.down) {
            this.body.setVelocityY(Math.min(oldSpeedY + this.speedIncrement, this.maxSpeed));
            targetAnim = 'player-down';
        }

        if (targetAnim !== '') {
            this.anims.play(targetAnim, true);
        } else {
            this.anims.stop();
        }
        */

        this.body.velocity.x = 0;

        if (controls.left) {

            this.speed -= this.speedChange;
            this.speed = Math.max(this.speed, -this.speedMax);
            this.body.velocity.x = this.speed;

            this.facing = 'left';
            this.idle = false;

        } else if (controls.right) {

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

        if (controls.aDown && this.body.onFloor() && time > this.jumpTimer) {
            this.body.velocity.y = -125;
            this.jumpTimer = time + 250;
        }

        if (this.body.onFloor()) {

            if (this.idle) {

                if (this.facing === 'left') {
                    this.ani = 'idle-left';
                } else {
                    this.ani = 'idle-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'run-left';
                } else {
                    this.ani = 'run-right';
                }

            }

        } else {

            if (this.body.velocity.y < 0) {

                if (this.facing === 'left') {
                    this.ani = 'jump-left';
                } else {
                    this.ani = 'jump-right';
                }

            } else {

                if (this.facing === 'left') {
                    this.ani = 'flail-left';
                } else {
                    this.ani = 'flail-right';
                }

            }
        }

        // don't forget to animate :)
        this.anims.play(this.ani, true);

    }
}

export default Player;
