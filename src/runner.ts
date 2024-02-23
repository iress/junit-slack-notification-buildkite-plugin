import {JunitResult} from "./interfaces/junitResult.interface";
import {sendResultToSlack} from "./slackNotification";
import {parseFiles} from "./xmlParser";
import {getStats} from "./testcaseStats";

export const run = async (): Promise<void> => {
    const commit: JunitResult = {
        build_id: parseInt(process.env.BUILDKITE_BUILD_NUMBER, 10),
        build_url: process.env.BUILDKITE_BUILD_URL,
        buildkite_pipeline: process.env.BUILDKITE_PIPELINE_NAME,
        git_branch_name: process.env.BUILDKITE_BRANCH,
        git_comment: process.env.BUILDKITE_MESSAGE.split("\n")[0],
        git_log: process.env.BUILDKITE_COMMIT.substring(0, 7),
        git_username: process.env.BUILDKITE_BUILD_AUTHOR,
        suite: []
    };

    const SLACK_TOKEN = process.env.SLACK_TOKEN;
    const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

    if (process.env.TEST_SUITES_0_ARTIFACTS || "" !== "") {
        let i = 0;
        while ((process.env[`TEST_SUITES_${i}_ARTIFACTS`] || "") !== "" && i < 6) {
            console.log(`Checking ${process.env[`TEST_SUITES_${i}_NAME`] || process.env[`TEST_SUITES_${i}_ARTIFACTS`]}`);
            const testsuite = await parseFiles(process.env[`TEST_SUITES_${i}_ARTIFACTS`]);
            const partialResult = await getStats(testsuite);
            const name = process.env[`TEST_SUITES_${i}_NAME`] || "";
            const result = {
                ...partialResult,
                name
            };
            commit.suite.push(result);
            i++;
        }
    } else {
        const ARTIFACTS = process.env.ARTIFACTS || "**/*.xml";
        const testsuite = await parseFiles(ARTIFACTS);
        const result = await getStats(testsuite);
        commit.suite.push(result);
    }

    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, commit)
        .then(() => console.log("completed."));
};
