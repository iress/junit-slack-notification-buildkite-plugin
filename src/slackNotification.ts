import {JunitResult} from "./interfaces/junitResult.interface";
import {sendSlackMessage} from "./slack-web-api";
import {flatten} from "lodash";
import {JunitSuiteResult} from "./interfaces/junitSuiteResult.interface";

export const getColor = (results: JunitResult): string => {
    if (results.suite.some(result => result.tests_failed > 0)) {
        return "#B94A48";
    }
    const summaries = results.suite.map(result  => getSummary(result));
    if (flatten(summaries).length === 0) {
        return "#B94A48";
    }
    return "#69A76A";
};

export const getEmoji = (results: JunitResult): string => {
    if (results.suite.some(result => result.tests_failed > 0)) {
        return ":-1: :-1:";
    }
    const summaries = results.suite.map(result  => getSummary(result));
    if (flatten(summaries).length === 0) {
        return ":-1:";
    }
    return ":+1:";
};

export const getSummary = (result: JunitSuiteResult): string[] => {
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

export const getTextSummaryLine = (result: JunitSuiteResult): string => {
    const summary = getSummary(result);
    const name = !result.name? "" : `*${result.name}*: `;
    if (summary.length > 0 && result.name) {
        return `${name}Tests ${summary.join(", ")}`;
    } else if (summary.length > 0 && !result.name) {
        return `*Tests ${summary.join(", ")}*`;
    }
    return `${name}*No tests data generated!*`;
};

export const getCommitText = (results: JunitResult): string => {
    return `${getEmoji(results)} *${results.buildkite_pipeline} (${results.git_branch_name}) #${results.build_id}*\n${results.git_comment} - ${results.git_username} (${results.git_log})`;
};

export const getSlackMessageAttachments = (results: JunitResult): unknown  => {
    const details = results.suite.map((result) => {
        return {
            "type": "section",
            "text": {
                "text": `${getTextSummaryLine(result)}`,
                "type": "mrkdwn"
            }
        };
    });

    const extra = results.extra_message?.length > 0? [
        {
            "type": "section",
            "text": {
                "text": results.extra_message,
                "type": "mrkdwn"
            }
        }
    ]: [];

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
                        "url": results.build_url
                    }
                },
                ...details,
                ...extra
            ]
        }
    ];
};

export const sendResultToSlack = async (slackToken: string | undefined, channel: string, junitResult: JunitResult): Promise<unknown> => {
    let goodToken = "";
    if (!slackToken || slackToken.length === 0) {
        throw new Error("No slack token found");
    }
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
