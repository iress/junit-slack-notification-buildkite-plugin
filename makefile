SHELL := /bin/bash
.SILENT:

BUILDKITE_BUILD_NUMBER ?= local
IMAGE_NAME ?= slack-notification

BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_DOCKER_CACHE ?=

test: build run

build:
	echo building $(IMAGE_NAME):build-${BUILDKITE_BUILD_NUMBER}
	docker build --tag=$(IMAGE_NAME):build-${BUILDKITE_BUILD_NUMBER} --build-arg DOCKER_CACHE=${BUILDKITE_PLUGIN_JUNIT_SLACK_NOTIFICATION_DOCKER_CACHE} .

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