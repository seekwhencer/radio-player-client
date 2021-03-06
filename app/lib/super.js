const
    Event = require('events');

module.exports = class Super {

    constructor(args) {
        this.name = 'super';
        this.label = 'SUPER';
        this.args = args;
        this.options = {};
        this.event = new Event();
    }

    mergeOptions() {
        this.defaults = CONFIG[this.name];
        if (typeof this.args === 'object') {
            this.options = R.merge(this.defaults, this.args);
        } else {
            this.options = this.defaults;
        }
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }

    get args() {
        return this._args;
    }

    set args(param) {
        this._args = param;
    }

    get name() {
        return this._name;
    }

    set name(param) {
        this._name = param;
    }

    get label() {
        return this._label;
    }

    set label(param) {
        this._label = param;
    }

    get options() {
        return this._options;
    }

    set options(param) {
        this._options = param;
    }

    get defaults() {
        return this._defaults;
    }

    set defaults(param) {
        this._defaults = param;
    }

};