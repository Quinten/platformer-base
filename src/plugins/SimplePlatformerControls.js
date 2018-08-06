class SimplePlatformerControls extends Phaser.Plugins.ScenePlugin {

    constructor (scene, pluginManager) {
        super(scene, pluginManager);
        this.cursors = undefined;
        this.xbox = Phaser.Input.Gamepad.Configs.XBOX_360;
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;
        this.aDown = false;
        //this.bDown = false;
        this.events = new Phaser.Events.EventEmitter();
        this.input = undefined;
    }

    start() {

        if (!this.input) {
            this.input = this.scene.input;
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.gamepad.on('down', (pad, button, index) => {
            switch (button.index) {
                case 0:
                    this.aDown = true;
                    break;
            }
        }, this);

        this.input.keyboard.on('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    this.aDown = true;
                    break;
                /*
                case 'KeyF':
                    this.bDown = true;
                    break;
                */
            }
        });

        this.input.gamepad.on('up', (pad, button, index) => {
            switch (button.index) {
                case 0:
                    this.aDown = false;
                    this.events.emit('aup');
                    break;
            }
        }, this);

        this.input.keyboard.on('keyup', (e) => {
            switch (e.code) {
                case 'Space':
                    this.aDown = false;
                    this.events.emit('aup');
                    break;
            }
        });

        this.scene.events.on('preupdate', this.preUpdate, this);
        this.scene.events.on('shutdown', this.shutdown, this);
    }

    preUpdate()
    {
        let input = this.input;
        if (input.gamepad && input.gamepad.gamepads && input.gamepad.gamepads[0]) {
            this.up = this.cursors.up.isDown || input.gamepad.gamepads[0].buttons[this.xbox.UP].pressed;
            this.right = this.cursors.right.isDown || input.gamepad.gamepads[0].buttons[this.xbox.RIGHT].pressed;
            this.down = this.cursors.down.isDown || input.gamepad.gamepads[0].buttons[this.xbox.DOWN].pressed;
            this.left = this.cursors.left.isDown || input.gamepad.gamepads[0].buttons[this.xbox.LEFT].pressed;
        } else {
            this.up = this.cursors.up.isDown;
            this.right = this.cursors.right.isDown;
            this.down = this.cursors.down.isDown;
            this.left = this.cursors.left.isDown;
        }
    }

    shutdown()
    {
        this.scene.events.off('preupdate', this.preUpdate);
        this.scene.events.off('shutdown', this.shutdown);
    }
}

export default SimplePlatformerControls;
