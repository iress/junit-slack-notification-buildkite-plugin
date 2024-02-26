import {JunitSuiteResult} from "./junitSuiteResult.interface";

export interface JunitResult {
    build_id: number,
    build_url: string;
    buildkite_pipeline: string,
    extra_message?: string;
    git_branch_name: string,
    git_comment: string,
    git_log: string,
    git_username: string,
    suite: JunitSuiteResult[];
}