import 'phaser';
import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import Level from './scenes/Level.js';
import AnimatedTiles from './plugins/AnimatedTiles.js';
import SimplePlatformerControls from './plugins/SimplePlatformerControls.js';

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    backgroundColor: '#00ff00',
    pixelArt: true,
    zoom: 2,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
            //debug: true
        }
    },
    plugins: {
        scene: [
            { key: 'animatedTiles', plugin: AnimatedTiles, mapping: 'animatedTiles' },
            { key: 'simplePlatformerControls', plugin: SimplePlatformerControls, mapping: 'controls' }
        ]
    },
    input: {
        gamepad: true
    },
    scene: [
        Boot,
        Preloader,
        Level
    ]
};

// improve iframe focus
window.addEventListener('load', function () {
    window.focus();
    document.body.addEventListener('click',function(e) {
        window.focus();
    },false);
});

// start game
window.game = new Phaser.Game(config);
