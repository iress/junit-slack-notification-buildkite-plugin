import {JunitSuiteResult} from "./junitSuiteResult.interface";

export interface JunitResult {
    buildkite_pipeline: string,
    git_branch_name: string,
    build_id: number,
    git_comment: string,
    git_username: string,
    git_log: string,
    build_url: string;
    suite: JunitSuiteResult[];
}