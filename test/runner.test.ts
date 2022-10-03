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
const addStatsToCommitMock = jest.fn().mockResolvedValue({});
jest.mock("../src/testcaseStats", () => ({
    addStatsToCommit: addStatsToCommitMock
}));

import {run} from "../src/runner";

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
    });
});
afterEach(() => {
    restore();
});

describe("When the runner is called", () => {
    it("should parse multi-line messages, add stats and send to slack", async () => {
        restore = mockedEnv({
            BUILDKITE_MESSAGE: `line 1
line 2
line 3`,
        });
        await run();
        expect(parseFilesMock).toHaveBeenCalled();
        expect(addStatsToCommitMock).toHaveBeenCalledWith([], {
            "build_id": 123,
            "build_url": "http://bk/b",
            "buildkite_pipeline": "pipeline name",
            "git_branch_name": "branch-name",
            "git_comment": "line 1",
            "git_log": "0123456",
            "git_username": "the-author",
            "tests_failed": 0,
            "tests_ignored": 0,
            "tests_passed": 0
        });
        expect(sendResultToSlackMock).toHaveBeenCalled();
        
    });

    it("should parse, add stats and send to slack ", async () => {
        await run();
        expect(parseFilesMock).toHaveBeenCalled();
        expect(addStatsToCommitMock).toHaveBeenCalledWith([], {
            "build_id": 123,
            "build_url": "http://bk/b",
            "buildkite_pipeline": "pipeline name",
            "git_branch_name": "branch-name",
            "git_comment": "msg",
            "git_log": "0123456",
            "git_username": "the-author",
            "tests_failed": 0,
            "tests_ignored": 0,
            "tests_passed": 0
        });
        expect(sendResultToSlackMock).toHaveBeenCalled();
        
    });
});