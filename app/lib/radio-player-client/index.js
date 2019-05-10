const
    Super = require('../super.js'),
    Client = require('./client.js'),
    Player = require('./player.js');

module.exports = class RadioPlayerClient extends Super {

    constructor(args) {
        super(args);

        this.name = 'radio-player-client';
        this.label = 'RADIO-PLAYER-CLIENT';

        LOG(this.label, 'INIT');
        this.mergeOptions();

        this.client = new Client();
        this.player = new Player();

    }

    play(){
        this.player.start(this.client.mount);
    }

    skip(){
        this.client.skipTrack();
    }

};