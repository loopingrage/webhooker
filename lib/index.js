"use strict";

const http = require('http');
const config = require('config');
const URL = require('url');
const colors = require('colors/safe');

const sourceConfig = config.get('source');
const destinationConfig = config.get('destination');

const pubnub = require("pubnub")(sourceConfig.config);

pubnub.subscribe({
    channel  : sourceConfig.config.channels,
    message : function(message) {

        // Clear host header so node http client
        // won't send to original destination
        delete message.headers.host;

        const url = URL.parse(destinationConfig.url);

        const options = {
            host: url.host,
            path: url.path,
            headers: message.headers
        }

        var req = http.request(options, (res) => {
            console.log(colors.white(`< ${res.statusCode}`));
        });

        req.on('error', (e) => {
          log.error(colors.red.bold(`< ERROR`));
        });

        console.log(colors.green('> ' + JSON.stringify(message)));

        req.write(message.body);
        req.end();
    }
});
