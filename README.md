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
      - iress/junit-slack-notification#v1.0.4b:
          artifacts: "**/*.xml"
          SLACK_TOKEN: "xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
          SLACK_CHANNEL: "#junit_bot_testing"
```
or
```yml
steps:
  - label: Run unit tests
    key: my-unit-test
    command: ...
  - label: Run Verification tests
    key: my-verification-test
    command: ...
    
  - label: ":slack: :memo: to #junit_bot_testing"
    depends_on: my-test
    allow_dependency_failure: true
    plugins:
      - iress/junit-slack-notification#v1.0.4b:
          test_suites:
              - name: "Unit tests"
                artifacts: "unit-test/**/*.xml"
              - name: "Verification tests"
                artifacts: "verification-test/**/*.xml"
          SLACK_TOKEN: "xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
          SLACK_CHANNEL: "#junit_bot_testing"
```

## Configuration

### `artifacts` (Use if no `test_suites`, string, default `**/*.xml` )

The file pattern to use to retrieve JUnit XML reports

### `test_suites` (object)

The object containing the JUnit XML reports. The object should be in the following format:

```yml
test_suites:
  - name: "Test Suite 1"
    artifacts: "test-suite-1/**/*.xml"
  - name: "Test Suite 2"
    artifacts: "test-suite-1/**/*.xml"

```

### `SLACK_CHANNEL` (Required, string)

Name of the public Slack channel which your bot will report _e.g._ `#junit_bot_testing`

### `SLACK_TOKEN_ENV_NAME` (String)

Name of the environment variable that contains the Slack API token. Default value: `"SLACK_TOKEN"`

### `SLACK_TOKEN` (string)

The token of your Slack application which is allows chatting on your Slack organisation. 

### `DOCKER_CACHE` (string) 

If you which to use a Docker registry proxy, specify the path prefix here

### `EXTRA_SLACK_MESSAGE` (string)

Contains an extra message to add on the bottom of the generated message. You can include a variable using the syntax `{var}`.

```yaml
EXTRA_SLACK_MESSAGE: "This project has a libyear of {LIBYEAR_DRIFT}"
```
with `LIBYEAR_DRIFT` environment variable set to `0.5` will add the message _This project has a libyear of 0.5_

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
