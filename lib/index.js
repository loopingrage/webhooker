"use strict";

const http = require('http');
const https = require('https');
const config = require('config');
const URL = require('url');
const colors = require('colors/safe');

// Source Config
const sourceConfig = config.get('source');
const pubnub = require("pubnub")(sourceConfig.config);

// Destination Config
const destinationConfig = config.get('destination');
const destinationUrl = URL.parse(destinationConfig.url);
let destinationClient = null;

switch(destinationUrl.protocol) {
  case 'http:':
    destinationClient = http;
    break;
  case 'https:':
    destinationClient = https;
    break;
  default:
    throw new Error('Destination protocol must be http or https');
    return;
}

// Listen for new messages
pubnub.subscribe({

    channel  : sourceConfig.config.channels,

    message : function(message) {

        // Clear host header so node http client
        // won't send to original destination
        delete message.headers.host;

        const options = {
            host: destinationUrl.hostname,
            path: destinationUrl.path,
            headers: message.headers,
            method: destinationConfig.method || message.method
        }

        if(destinationUrl.port) {
          options.port = destinationUrl.port;
        }

        var req = destinationClient.request(options, (res) => {
            console.log(colors.white(`< ${res.statusCode}`));
        });

        req.setTimeout(destinationConfig.timeout || 5000);

        req.on('error', (e) => {
          console.error(colors.red.bold(`< ERROR - ${e}`));
        });

        console.log(colors.green('> ' + JSON.stringify(message)));

        req.write(message.body);
        req.end();
    }
});
