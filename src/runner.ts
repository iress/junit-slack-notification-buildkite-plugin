import {JunitResult} from "./interfaces/junitResult.interface";
import {sendResultToSlack} from "./slackNotification";
import {parseFiles} from "./xmlParser";
import {addStatsToCommit} from "./testcaseStats";

export const run = async () => {
    console.log("--- List all environment variables");
    for (const property in process.env) {
        if (!property.toLowerCase().includes("token")){
            console.log(`${property}: ${process.env[property]}`);
        }
    }
    console.log("--- Run");
    const commit: JunitResult = {
        name: "",
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

    const results:JunitResult[] = [];

    if (process.env.TEST_SUITES_0_ARTIFACTS || "" !== "") {
        let i = 0;
        while ((process.env[`TEST_SUITES_${i}_ARTIFACTS`] || "") !== "") {
            console.log(`Checking ${process.env[`TEST_SUITES_${i}_NAME`] || process.env[`TEST_SUITES_${i}_ARTIFACTS`]}`);
            const testsuite = await parseFiles(process.env[`TEST_SUITES_${i}_ARTIFACTS`]);
            const partialResult = await addStatsToCommit(testsuite, commit);
            const result = {
                name: process.env[`TEST_SUITES_${i}_NAME`] || "",
                ...partialResult
            };
            results.push(result);
            i++;
        }
    } else {
        const ARTIFACTS = process.env.ARTIFACTS || "**/*.xml";
        const testsuite = await parseFiles(ARTIFACTS);
        const result = await addStatsToCommit(testsuite, commit);
        results.push(result);
    }

    await sendResultToSlack(SLACK_TOKEN, SLACK_CHANNEL, results)
        .then(() => console.log("completed."));
};
