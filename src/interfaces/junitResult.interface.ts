export interface JunitResult {
    name: string | undefined,
    buildkite_pipeline: string,
    git_branch_name: string,
    build_id: number,
    git_comment: string,
    git_username: string,
    git_log: string,
    tests_failed: number,
    tests_passed: number,
    tests_ignored: number,
    build_url: string;
}