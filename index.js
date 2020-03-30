const { isMaster, fork } = require('cluster');
const { cpus } = require('os');
const rpc = require('./rpc');
const slotsEngine = require('./engine');

isMaster ? cpus().forEach(fork) : rpc({ slotsEngine }, process.argv[2] || 3000);
