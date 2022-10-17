#!/usr/bin/env bats

load '/usr/local/lib/bats/load.bash'

# Uncomment the following line to debug stub failures
# export BUILDKITE_AGENT_STUB_DEBUG=/dev/tty

@test "Download, compile and send message" {

  export BUILDKITE_PLUGIN_artifacts="**/*.xml"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL="#junit_bot_testing"

  stub buildkite-agent 'artifact download : echo Download artifacts'
  stub make

  run "$PWD/hooks/command"

  assert_success
  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "--- Compile Typescript"
  assert_output --partial "--- Send message to #junit_bot_testing"

  unstub buildkite-agent
}

@test "Download, compile and send message with default environment variable" {

  export SLACK_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"

  export BUILDKITE_PLUGIN_artifacts="**/*.xml"
  export BUILDKITE_PLUGIN_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL=$BUILDKITE_PLUGIN_SLACK_CHANNEL


  stub buildkite-agent 'artifact download : echo Download artifacts'
  stub make

  run "$PWD/hooks/command"

  assert_success
  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "--- Compile Typescript"
  assert_output --partial "--- Send message to #junit_bot_testing"

  unstub buildkite-agent
}

@test "Download, compile and send message with custom environment variable" {

  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_TOKEN_ENV_NAME="CUSTOM_TOKEN"
  export CUSTOM_TOKEN="xoxb-xxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx"

  export BUILDKITE_PLUGIN_artifacts="**/*.xml"
  export BUILDKITE_PLUGIN_SLACK_CHANNEL="#junit_bot_testing"
  export BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_SLACK_CHANNEL=$BUILDKITE_PLUGIN_SLACK_CHANNEL


  stub buildkite-agent 'artifact download : echo Download artifacts'
  stub make

  run "$PWD/hooks/command"

  assert_success
  assert_output --partial "--- :junit: Download the junits XML"
  assert_output --partial "--- Compile Typescript"
  assert_output --partial "--- Send message to #junit_bot_testing"

  unstub buildkite-agent
}
