export interface JunitSuiteResult {
    name?: string | undefined,
    tests_failed: number,
    tests_passed: number,
    tests_ignored: number,
}