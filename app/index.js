const
    rpc = require('./lib/radio-player-client/index.js');

require('./lib/globals');

global.RPC = new rpc();
module.exports = RPC;
