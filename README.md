# Slack DM archive

## Overview

Sample Application for Skack API, which can retrieve all DM messages in specific channel.


## Pre-requisite

- Slack account

- Slack App

    - Login to https://api.slack.com/apps

      - Your app would be enabled only for this user's Slack workspaces:

    - Create app

    - Add following 4 scopes:

      - channels:history

      - gropus:history

      - im:history

      - mpim:history
    
    - Find OAuth User Token

      - Set environment value as SLACK_USER_OAUTH_TOKEN
    
    - Find ID of target channel

      - Set environment value as SLACK_CHANNEL_ID, or set query parameter as `channel_id`


## How to use

- Run application

  - `$ npm install`

  - `$ SLACK_USER_OAUTH_TOKEN=xxxxxx node app`

- Run **history** API

  - `http://localhost:8080/history?channel_id=XXXXXX`


## Links

- Slack API

    - https://api.slack.com/


## References

- How to get Tokens and Channel ID
  - https://qiita.com/reiya018/items/1942c00c7e792cbff0f0

- `conversations.history`
  - https://api.slack.com/methods/conversations.history


## Copyright

2023 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
