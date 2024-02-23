import {describe, expect, it, beforeEach} from "@jest/globals";
import mockedEnv from "mocked-env";

let restore = mockedEnv({
    BUILDKITE_BUILD_NUMBER: "123",
    BUILDKITE_BUILD_URL: "http://bk/b",
    BUILDKITE_PIPELINE_NAME: "pipeline name",
    BUILDKITE_BRANCH: "branch-name",
    BUILDKITE_MESSAGE: "msg",
    BUILDKITE_BUILD_AUTHOR: "the-author",
    BUILDKITE_COMMIT: "0123456789",
    SLACK_TOKEN: "slack-token",
    SLACK_CHANNEL: "slack-channel",
}); // to restore old values

const sendResultToSlackMock = jest.fn().mockResolvedValue({});
jest.mock("../src/slackNotification", () => ({
    sendResultToSlack: sendResultToSlackMock
}));
const parseFilesMock = jest.fn().mockResolvedValue([]);
jest.mock("../src/xmlParser", () => ({
    parseFiles: parseFilesMock
}));
//
const getStatsMock = jest.fn().mockResolvedValue({});
jest.mock("../src/testcaseStats", () => ({
    getStats: getStatsMock
}));

import {run} from "../src/runner";


describe("When the runner is called using single artifacts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        restore = mockedEnv({
            BUILDKITE_BUILD_NUMBER: "123",
            BUILDKITE_BUILD_URL: "http://bk/b",
            BUILDKITE_PIPELINE_NAME: "pipeline name",
            BUILDKITE_BRANCH: "branch-name",
            BUILDKITE_MESSAGE: "msg",
            BUILDKITE_BUILD_AUTHOR: "the-author",
            BUILDKITE_COMMIT: "0123456789",
            SLACK_TOKEN: "slack-token",
            SLACK_CHANNEL: "slack-channel",
            ARTIFACTS: "**/*.xml",
        });
    });
    afterEach(() => {
        restore();
    });

    it("should parse multi-line messages, add stats and send to slack", async () => {
        restore = mockedEnv({
            BUILDKITE_MESSAGE: `line 1
line 2
line 3`,
        });
        await run();
        expect(parseFilesMock).toHaveBeenCalled();
        expect(getStatsMock).toHaveBeenCalledWith([]);
        expect(sendResultToSlackMock).toHaveBeenCalled();

    });

    it("should parse, add stats and send to slack ", async () => {
        await run();
        expect(parseFilesMock).toHaveBeenCalled();
        expect(getStatsMock).toHaveBeenCalledWith([]);
        expect(sendResultToSlackMock).toHaveBeenCalled();

    });
});

describe("When the runner is called with a suite", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        restore = mockedEnv({
            BUILDKITE_BUILD_NUMBER: "123",
            BUILDKITE_BUILD_URL: "http://bk/b",
            BUILDKITE_PIPELINE_NAME: "pipeline name",
            BUILDKITE_BRANCH: "branch-name",
            BUILDKITE_MESSAGE: "msg",
            BUILDKITE_BUILD_AUTHOR: "the-author",
            BUILDKITE_COMMIT: "0123456789",
            SLACK_TOKEN: "slack-token",
            SLACK_CHANNEL: "slack-channel",
            TEST_SUITES_0_NAME: "Unit tests",
            TEST_SUITES_0_ARTIFACTS: "src/packages/*/test-report.xml",
            TEST_SUITES_1_NAME: "Verification tests",
            TEST_SUITES_1_ARTIFACTS: "src/playwright/results/*-results.xml",
        });
    });
    afterEach(() => {
        restore();
    });

    it("should parse multi-line messages, add all stats and send to slack", async () => {
        restore = mockedEnv({
            BUILDKITE_MESSAGE: `line 1
line 2
line 3`,
        });
        await run();
        expect(parseFilesMock).toHaveBeenCalledTimes(2);
        expect(parseFilesMock).toHaveBeenCalledWith("src/packages/*/test-report.xml");
        expect(parseFilesMock).toHaveBeenCalledWith("src/playwright/results/*-results.xml");
        expect(getStatsMock).toHaveBeenCalledTimes(2);
        expect(getStatsMock).toHaveBeenCalledWith([]);
        expect(sendResultToSlackMock).toHaveBeenCalledWith("slack-token", "slack-channel", {
            "build_id": 123,
            "build_url": "http://bk/b",
            "buildkite_pipeline": "pipeline name",
            "git_branch_name": "branch-name",
            "git_comment": "line 1",
            "git_log": "0123456",
            "git_username": "the-author",
            "suite": [{"name": "Unit tests"}, {"name": "Verification tests"}]
        });

    });
});