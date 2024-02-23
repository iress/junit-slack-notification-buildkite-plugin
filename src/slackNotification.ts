import {JunitResult} from "./interfaces/junitResult.interface";
import {sendSlackMessage} from "./slack-web-api";
import {flatten} from "lodash";

export const getColor = (results: JunitResult[]): string => {
    if (results.some(result => result.tests_failed > 0)) {
        return "#B94A48";
    }
    const summaries = results.map(result  => getSummary(result));
    if (flatten(summaries).length === 0) {
        return "#B94A48";
    }
    return "#69A76A";
};

export const getEmoji = (results: JunitResult[]): string => {
    if (results.some(result => result.tests_failed > 0)) {
        return ":-1: :-1:";
    }
    const summaries = results.map(result  => getSummary(result));
    if (flatten(summaries).length === 0) {
        return ":-1:";
    }
    return ":+1:";
};

export const getSummary = (result: JunitResult): string[] => {
    const summary = [];
    if (result.tests_failed > 0) {
        summary.push(`failed: ${result.tests_failed}`);
    }
    if (result.tests_passed > 0) {
        summary.push(`passed: ${result.tests_passed}`);
    }
    if (result.tests_ignored > 0) {
        summary.push(`ignored: ${result.tests_ignored}`);
    }
    return summary;
};

export const getTextSummaryLine = (result: JunitResult): string => {
    const summary = getSummary(result);
    const name = !result.name? "" : `*${result.name}*: `;
    if (summary.length > 0 && result.name) {
        return `${name}Tests ${summary.join(", ")}`;
    } else if (summary.length > 0 && !result.name) {
        return `*Tests ${summary.join(", ")}*`;
    }
    return `${name}*No tests data generated!*`;
};

export const getCommitText = (results: JunitResult[]): string => {
    return `${getEmoji(results)} *${results[0].buildkite_pipeline} (${results[0].git_branch_name}) #${results[0].build_id}*\n${results[0].git_comment} - ${results[0].git_username} (${results[0].git_log})`;
};

export const getSlackMessageAttachments = (results: JunitResult[]): unknown  => {
    const details = results.map((result) => {
        return {
            "type": "section",
            "text": {
                "text": `${getTextSummaryLine(result)}`,
                "type": "mrkdwn"
            }
        };
    });

    return [
        {
            "color": getColor(results),
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": getCommitText(results)
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "View build"
                        },
                        "url": results[0].build_url
                    }
                },
                ...details
            ]
        }
    ];
};

export const sendResultToSlack = async (slackToken: string, channel: string, junitResult: JunitResult[]): Promise<unknown> => {
    let goodToken = "";
    for (let i = 0; i < slackToken.length; i++) {
        if (checkChar(slackToken[i])) {
            goodToken += slackToken[i];
        } else {
            // Allows debugging of unexpected character in token received without exposing the complete token.
            console.warn(`Invalid character in token - code: ${slackToken.charCodeAt(i)} => '${slackToken[i]}'`);
        }
    }
    return sendSlackMessage(goodToken, channel, getSlackMessageAttachments(junitResult) as any[]);
};

const checkChar = (c: string) => {
    const code = c.charCodeAt(0);
    const isAlpha = code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0);
    const isUpperAlpha = code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0);
    const isNumber = code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0);
    const isDash = code == "-".charCodeAt(0);
    return isAlpha || isUpperAlpha || isNumber || isDash;
};
