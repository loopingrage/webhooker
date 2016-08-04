# CLI & Replay Agent for Webhooker.com

### Webhooker.com

[Webhooker](webhooker.com) is a lightweight cloud service that receives your webhooks and forwards them to PubNub. Advantages to front-ending webhooks with PubNub are:

- **Websockets** get you through firewalls and eliminate the need to open ports
- **Queuing** allows your app to consume webhooks at its own pace
- **Analytics** on [PubNub Console](https://admin.pubnub.com) are awesome

So how do you get the messages out of PubNub?

### Replay Agent

This module consumes messages from PubNub and replays the original  webhook to an HTTP destination of your choosing. This is super useful if your webserver is behind a firewall!

To install just just do:

```
npm install webhooker -g
```

You'll then need to configure a source and a destination. Webhooker load it's config from `$CWD/config/default.json` in the following format:

```
{
  "source": {
    "type": "pubnub",
    "config": {
      "ssl": true,
      "channels": ["webhooks1","webhooks2","webhooks3"],
      "publish_key": "pub-xxxxxxxxxxxxxxxxxx",
      "subscribe_key": "pub-xxxxxxxxxxxxxxxxxx"
    }
  },
  "destination": {
    "url": "http://requestb.in/1n1jjbt1",
    "method": "POST"
  }
}

```
