/**
 * This is the api client for the radio automation app
 *
 * The client do:
 *  - get the channel list with ids and mount points from the api
 *  - send a 'restart channel' event to the api
 *  - skip a track on selected channel
 *  - if a channel is set, it sends a 'restart channel' to the api if 'autoStart' is true
 *  - setChannel(value, field) sets a channel by given id (value) and a empty field
 *    possible fields could be: id, mount, name
 *
 */
const
    Super = require('../super.js'),
    http = require("http");

module.exports = class Client extends Super {

    constructor(args) {
        super(args);

        this.name = 'client';
        this.label = 'CLIENT';

        this.channels = false;
        this.channel = false;
        this.mount = false;

        LOG(this.label, 'INIT');
        this.mergeOptions();

        //
        // events
        //
        this.on('channels', function () {
            LOG(this.label, 'GOT CHANNELS:', this.channels.length);
        }.bind(this));

        this.on('channel', function () {
            LOG(this.label, 'CHANNEL SET:', this.channel.id);
        }.bind(this));

        this.on('playing', function () {
            LOG(this.label, 'PLAYING CHANNEL:', this.channel.id);

            // starting delayed the playback
            setTimeout(function () {
                //RPC.player.start(this.channel.mount);
                RPC.play();
            }, 4000);

            // testing delayed the skip track function
            setTimeout(function () {
                //RPC.client.skipTrack();
                RPC.skip();
            }, 30000);

        }.bind(this));

        this.on('skipping', function () {
            LOG(this.label, 'SKIPPING TRACK ON CHANNEL:', this.channel.id);
        }.bind(this));

        // start
        this.fetchChannels();
    }

    mergeOptions() {
        super.mergeOptions();
        this.baseUrl = this.options.baseUrl;
    }

    fetch(url, callback) {
        http.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on('data', data => {
                body += data;
            });
            res.on("end", () => {
                callback(body);
            });
        });
    }

    fetchChannels() {
        const client = this;
        const url = `${this.baseUrl}/channels`;
        this.fetch(url, data => {
            client.channels = JSON.parse(data);
            client.emit('channels', client);
            client.setChannel(this.options.startup.value, this.options.startup.field);
        });
    }

    updateChannels() {
        this.fetchChannels();
    }

    setChannel(value, field) {
        if (value) {
            this.channel = this.getChannel(value, field);
            return;
        }
        if (this.channel === false || this.channel === undefined) {
            this.channel = this.channels[Math.floor((Math.random() * this.channels.length))];
            return;
        }
    }

    startChannel() {
        const client = this;
        const url = `${this.baseUrl}/channel/${this.channel.id}/update-playlist`;
        this.fetch(url, () => {
            client.emit('playing', client);
        });
    }

    skipTrack() {
        const client = this;
        const url = `${this.baseUrl}/channel/${this.channel.id}/skip`;
        this.fetch(url, () => {
            client.emit('skipping', client);
        });
    }

    getChannel(value, field) {
        if (!field) {
            field = 'id';
        }
        return this.channels.filter(channel => {
            if (channel[field] === value) {
                return channel;
            }
        })[0];
    }

    //
    //
    set channel(channel) {
        if (!channel)
            return false;

        this._channel = channel;
        this.mount = `${this.channel.mount}`;
        this.emit('channel', this);

        if (this.options.autoPlay === true) {
            this.startChannel();
        }
    }

    get channel() {
        return this._channel;
    }

    set channels(channels) {
        this._channels = channels;
    }

    get channels() {
        return this._channels;
    }

    set mount(mount) {
        this._mount = mount;
    }

    get mount() {
        return this._mount;
    }
};