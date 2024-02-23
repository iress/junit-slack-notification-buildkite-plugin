#!/usr/bin/env bats

load "${BATS_PLUGIN_PATH}/load.bash"

# Uncomment to get debug output from each stub
# export MKTEMP_STUB_DEBUG=/dev/tty
# export BUILDKITE_AGENT_STUB_DEBUG=/dev/tty
# export DOCKER_STUB_DEBUG=/dev/tty
# export DU_STUB_DEBUG=/dev/tty

@test "Download, compile and send message" {

  export BUILDKITE_PLUGIN_ARTIFACTS="**/*.xml"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL="#junit_bot_testing"

  stub buildkite-agent \
    "artifact download \* \* : echo Downloaded artifacts \$3 to \$4"
  stub make \
    "run : echo Run App using make"

  run "$PWD/hooks/command"

  assert_success

  assert_output --partial "Missing \$SLACK_TOKEN_ENV_NAME environment variable... looking for alternative"
  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "Downloaded artifacts **/*.xml to /plugin/junits-slack-notification-plugin-artifacts-tmp"
  assert_output --partial "--- Send message to #junit_bot_testing"
  assert_output --partial "Run App using make"

  unstub buildkite-agent
  unstub make
}

@test "Download, compile and send message with default environment variable" {

  export SLACK_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"

  export BUILDKITE_PLUGIN_ARTIFACTS="**/*.xml"
  export BUILDKITE_PLUGIN_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL=$BUILDKITE_PLUGIN_SLACK_CHANNEL

  stub buildkite-agent \
    "artifact download \* \* : echo Downloaded artifacts \$3 to \$4"
  stub make \
    "run : echo Run App using make"


  run "$PWD/hooks/command"

  assert_success

  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "Downloaded artifacts **/*.xml to /plugin/junits-slack-notification-plugin-artifacts-tmp"
  assert_output --partial "--- Send message to #junit_bot_testing"
  assert_output --partial "Run App using make"

  unstub buildkite-agent
  unstub make
}

@test "Download, compile and send message with custom environment variable" {

  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN_ENV_NAME="CUSTOM_TOKEN"
  export CUSTOM_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"

  export BUILDKITE_PLUGIN_ARTIFACTS="**/*.xml"
  export BUILDKITE_PLUGIN_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL=$BUILDKITE_PLUGIN_SLACK_CHANNEL

  stub buildkite-agent \
    "artifact download \* \* : echo Downloaded artifacts \$3 to \$4"
  stub make \
    "run : echo Run App using make"

  run "$PWD/hooks/command"

  assert_success
  
  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "Downloaded artifacts **/*.xml to /plugin/junits-slack-notification-plugin-artifacts-tmp"
  assert_output --partial "--- Send message to #junit_bot_testing"
  assert_output --partial "Run App using make"

  unstub buildkite-agent
  unstub make
}

@test "Failed send message without custom environment variable or Token" {

  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN_ENV_NAME=""
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN=""

  export BUILDKITE_PLUGIN_ARTIFACTS="**/*.xml"
  export BUILDKITE_PLUGIN_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL=$BUILDKITE_PLUGIN_SLACK_CHANNEL

  run "$PWD/hooks/command"

  assert_failure
  
  assert_output --partial "Missing \$SLACK_TOKEN_ENV_NAME environment variable... looking for alternative"
  assert_output --partial "Missing Slack token: either use \$SLACK_TOKEN or \$SLACK_TOKEN_ENV_NAME to set environment variable"
}

@test "Download test suite, compile and send message" {

  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_TEST_SUITES_0_NAME="Unit tests"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_TEST_SUITES_0_ARTIFACTS="src/packages/*/test-report.xml"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_TEST_SUITES_1_NAME="Verification tests"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_TEST_SUITES_1_ARTIFACTS="src/playwright/results/*-results.xml"

  stub buildkite-agent \
    "artifact download \* \* : echo Downloaded artifacts \$3 to \$4"
  stub buildkite-agent \
    "artifact download \* \* : echo Downloaded artifacts \$3 to \$4"
  stub make \
    "run : echo Run App using make"

  run "$PWD/hooks/command"

  assert_success

  assert_output --partial "Missing \$SLACK_TOKEN_ENV_NAME environment variable... looking for alternative"
  assert_output --partial "--- :junit: Download each junits XML from the Test suites"
  assert_output --partial "Downloaded artifacts src/packages/*/test-report.xml to /plugin/junits-slack-notification-plugin-artifacts-tmp"
  assert_output --partial "Downloaded artifacts src/playwright/results/*-results.xml to /plugin/junits-slack-notification-plugin-artifacts-tmp"
  assert_output --partial "--- Send message to #junit_bot_testing"
  assert_output --partial "Run App using make"

  unstub buildkite-agent
  unstub make
}

