SHELL := /bin/bash
.SILENT:

BUILDKITE_BUILD_NUMBER ?= local

BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_DOCKER_CACHE ?=

run:
	docker-compose run --rm slack-notification

clean:
	docker-compose down

prune:
	docker system prune -f

linter:
	docker-compose run --rm lint

tester:
	docker-compose run --rm tests