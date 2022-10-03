import {describe, expect, it, beforeEach} from "@jest/globals";
import {sendSlackMessage} from "../src/slack-web-api";

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

describe("When calling sendSlackMessage", () => {
    it("should call @slack/web-api WebClient chat.postMessage function", async () => {
        const slackToken = "xoxb-00000000000-0000000000000-xxxxxxxxxxxxxxxxxxxxxxxx",
            channel = "my-channel",
            attachments: any[] = [
                {
                    "blocks": [
                        {
                            "text": {
                                "text": "my message here",
                                "type": "mrkdwn"
                            },
                            "type": "section"
                        }
                    ],
                    "color": "#000000"
                }
            ];

        await sendSlackMessage(slackToken, channel, attachments);

        expect(mockToken).toEqual(slackToken);
        expect(_postMessageMock).toHaveBeenCalledWith({"attachments": attachments, "channel": channel, "text": "" });
        
    });
});