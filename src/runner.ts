import {JunitResult} from "./interfaces/junitResult.interface";
import {sendResultToSlack} from "./slackNotification";
import {parseFiles} from "./xmlParser";
import {addStatsToCommit} from "./testcaseStats";

export const run = async () => {
    const commit: JunitResult = {
        build_id: parseInt(process.env.BUILDKITE_BUILD_NUMBER, 10),
        build_url: process.env.BUILDKITE_BUILD_URL,
        buildkite_pipeline: process.env.BUILDKITE_PIPELINE_NAME,
        git_branch_name: process.env.BUILDKITE_BRANCH,
        git_comment: process.env.BUILDKITE_MESSAGE.split("\n")[0],
        git_log: process.env.BUILDKITE_COMMIT.substring(0, 7),
        git_username: process.env.BUILDKITE_BUILD_AUTHOR,
        tests_failed: 0,
        tests_passed: 0,
        tests_ignored: 0
    };

    const SLACK_TOKEN = process.env.SLACK_TOKEN;
    const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

    const testsuites = await parseFiles();
    const result = await addStatsToCommit(testsuites, commit);
    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, result)
        .then(() => console.log("completed."));
};
