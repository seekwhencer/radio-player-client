/**
 * This is the player module
 *
 *  - using omxplayer
 *  - start playback instantly if  'client.channel' is set
 *  - stop playback
 *
 */

const
    Super = require('../super.js'),
    spawn = require('child_process').spawn;

module.exports = class Player extends Super {
    constructor(args) {
        super(args);
        this.name = 'player';
        this.label = 'PLAYER';
        LOG(this.label, 'INIT');
        this.mergeOptions();

        this.url = false;
        this.proc = false;
    }

    start(mount) {
        if (this.proc !== false) {
            this.stop();
        }
        this.url = `${this.options.baseUrl}${mount}`;
        const processOptions = [this.url, '-o', 'alsa'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));
        this.proc = spawn(this.options.bin, processOptions);
        this.proc.stdout.setEncoding('utf8');
    }

    stop() {
        LOG(this.label, 'STOPPING PLAYBACK');
        this.proc.kill();
    }

    set url(url) {
        this._url = url;
    }

    get url() {
        return this._url;
    }
};