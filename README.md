# JUnit - Slack notification buildkite plugin

Use "JUnit XML report" to generate Slack notification from Buildkite

This plugin was inspired by
[junit-annotate-buildkite-plugin](https://github.com/buildkite-plugins/junit-annotate-buildkite-plugin)
which also retrieve JUnit XML reports and process them.

## Example

Add an extra step like this after running your tests to your `pipeline.yml`:
```yml
steps:
  - label: Run tests
    key: my-test
    command: ...
    
  - label: ":slack: :memo: to #junit_bot_testing"
    depends_on: my-test
    allow_dependency_failure: true
    plugins:
      - iress/junit-slack-notification#v1.0.0:
          artifacts: "**/*.xml"
          SLACK_TOKEN: "xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
          SLACK_CHANNEL: "#junit_bot_testing"
```

## Configuration

### `artifacts` (Required, string)

The file pattern to use to retrieve JUnit XML reports 
e.g. **/*.xml

### `SLACK_CHANNEL` (Required, string)

Name of the public Slack channel which your bot will report _e.g._ `#junit_bot_testing`

### `SLACK_TOKEN_ENV_NAME` (String)

Name of the environment variable that contains the Slack API token. Default value: `"SLACK_TOKEN"`

### `SLACK_TOKEN` (string)

The token of your Slack application which is allows chatting on your Slack organisation. 

### `DOCKER_CACHE` (string) 

If you which to use a Docker registry proxy, specify the path prefix here

## Create a bot for your workspace.
See Slack documentation [Create a bot for your workspace](https://slack.com/intl/en-fr/help/articles/115005265703-Create-a-bot-for-your-workspace) for instruction to create a Slack application.

Here a sample of your slack application manifest sample. Make sure the scope of your bot is allowed to `chat:write` & `chat:write:public`

```yaml
_metadata:
  major_version: 1
  minor_version: 0
display_information:
  name: JUnit Summary Bot
  description: JUnit run summary information
  background_color: "#000000"
features:
  bot_user:
    display_name: JUnit Summary Bot
    always_online: false
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```


## Developing

To start development, install dependency package and compile typescript
```shell
npm install
npm run build
```

To run unit tests in Jest

```shell
npm run test
```

## Contributing

1. Fork the repo
2. Make the changes
3. Run the tests
4. Commit and push your changes
5. Send a pull request

## Licence
MIT License (See the included [Licence](LICENSE) file for more information).
