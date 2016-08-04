"use strict";

const fs = require('fs');
const colors = require('colors/safe');

const configFile = process.argv[2];

let config = null;

try {
    config = JSON.parse(fs.readFileSync(configFile));
    console.log(colors.white.bold(`INIT - Loaded config from ${configFile}`));
}
catch(err) {
    console.error(`INIT - Failed to load config from '${configFile}'`, err);
    process.exit();
}

module.exports = config;
