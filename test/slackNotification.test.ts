import {JunitResult} from "../src/interfaces/junitResult.interface";
import {getColor, getEmoji, getSlackMessageAttachments, sendResultToSlack} from "../src/slackNotification";
import {beforeEach, describe, expect, it} from "@jest/globals";

const _postMessageMock = jest.fn(() => ({promise: true}));
let mockToken: string;

jest.mock("@slack/web-api", () => ({
  WebClient: class {
    constructor(token?: string) {
      mockToken = token;
    }
    chat = {
      postMessage: _postMessageMock
    };
  },
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockToken = undefined;
});

describe("Failed test", () => {
    const result: JunitResult = {
        tests_failed: 3,
        build_id: 123,
        build_url: "https://www.iress.com/mybuild",
        buildkite_pipeline: "My Build pipeline",
        git_branch_name: "hac-483_branch",
        git_comment: "Initial commit",
        git_log: "a1b2c3",
        git_username: "F T",
        tests_passed: 1,
        tests_ignored: 2
    };

    it("should return red", () => {
        const actual = getColor(result);

        expect(actual).toBe("#B94A48");

    });

    it("should return negative emoij", () => {
        const actual = getEmoji(result);

        expect(actual).toBe(":-1: :-1:");

    });

    it("should return summary slack message", () => {
        const actual = getSlackMessageAttachments(result);

        expect(actual).toStrictEqual([
            {
                "blocks": [
                    {
                        "accessory": {
                            "text": {
                                "text": "View build",
                                "type": "plain_text"
                            },
                            "type": "button",
                            "url": "https://www.iress.com/mybuild"
                        },
                        "text": {
                            "text": ":-1: :-1: *My Build pipeline (hac-483_branch) #123*\nInitial commit - F T (a1b2c3)",
                            "type": "mrkdwn"
                        },
                        "type": "section"
                    },
                    {
                        "text": {
                            "text": "*Tests failed: 3, passed: 1, ignored: 2*",
                            "type": "mrkdwn"
                        },
                        "type": "section"
                    }
                ],
                "color": "#B94A48"
            }
        ]);

    });

    it("send message to slack channel", async () => {
        const SLACK_TOKEN = "xoxb-00000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx\t";
        const SLACK_CHANNEL = "hac-483_testing";

        await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);

        expect(mockToken).toEqual("xoxb-00000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx");


    });
});

describe("Passed test", () => {
    const result: JunitResult = {
        tests_failed: 0,
        build_id: 456,
        build_url: "https://www.iress.com/myotherbuild",
        buildkite_pipeline: "My Build other pipeline",
        git_branch_name: "hac-483_other_branch",
        git_comment: "Second commit",
        git_log: "a1b2c3d4",
        git_username: "Frankly Chilled",
        tests_passed: 1,
        tests_ignored: 0
    };

    it("should return green", () => {

        const actual = getColor(result);

        expect(actual).toBe("#69A76A");

    });

    it("should return summary slack message", () => {
        const actual = getSlackMessageAttachments(result);

        expect(actual).toStrictEqual([
            {
                "blocks": [
                    {
                        "accessory": {
                            "text": {
                                "text": "View build",
                                "type": "plain_text"
                            },
                            "type": "button",
                            "url": "https://www.iress.com/myotherbuild"
                        },
                        "text": {
                            "text": ":+1: *My Build other pipeline (hac-483_other_branch) #456*\nSecond commit - Frankly Chilled (a1b2c3d4)",
                            "type": "mrkdwn"
                        },
                        "type": "section"
                    },
                    {
                        "text": {
                            "text": "*Tests passed: 1*",
                            "type": "mrkdwn"
                        },
                        "type": "section"
                    }
                ],
                "color": "#69A76A"
            }
        ]);

    });

    it("send message to slack channel", async () => {
        const SLACK_TOKEN = "xoxb-00000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx";
        const SLACK_CHANNEL = "hac-483_testing";

        await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);


    });
});

describe("No tests", () => {
    const result: JunitResult = {
        tests_failed: 0,
        build_id: 789,
        build_url: "https://www.iress.com/myotherbuild",
        buildkite_pipeline: "My Build other pipeline",
        git_branch_name: "hac-483_other_branch",
        git_comment: "Second commit",
        git_log: "a1b2c3d4",
        git_username: "Frankly Chilled",
        tests_passed: 0,
        tests_ignored: 0
    };

    it("should return summary slack message", () => {
        const actual = getSlackMessageAttachments(result);

        expect(actual).toStrictEqual([
            {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": ":-1: *My Build other pipeline (hac-483_other_branch) #789*\nSecond commit - Frankly Chilled (a1b2c3d4)"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "View build"
                            },
                            "url": "https://www.iress.com/myotherbuild"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "text": "*No tests data generated!*",
                            "type": "mrkdwn"
                        }
                    }
                ],
                "color": "#B94A48"
            }
        ]);

    });

    it("send message to slack channel", async () => {
        const SLACK_TOKEN = "xoxb-00000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx";
        const SLACK_CHANNEL = "hac-483_testing";

        await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result);

        // verify call to chat
        const attachments = [
            {
                "color": "#B94A48",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": ":-1: *My Build other pipeline (hac-483_other_branch) #789*\nSecond commit - Frankly Chilled (a1b2c3d4)"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "View build"
                            },
                            "url": "https://www.iress.com/myotherbuild"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "text": "*No tests data generated!*",
                            "type": "mrkdwn"
                        }
                    }
                ]
            }
        ];
        const expected = {channel: SLACK_CHANNEL, attachments, text: ""};
        expect(_postMessageMock).toHaveBeenCalledWith(expected);

    });
});