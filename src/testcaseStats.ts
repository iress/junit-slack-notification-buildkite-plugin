import {TestCasesStats} from "./interfaces/testCasesStats.interface";
import {JunitResult} from "./interfaces/junitResult.interface";
import {sumBy} from "lodash";

export const stats = (reportfile: any) => {
    const extractedTestSuite = (): any[] => {
        if (typeof reportfile["testsuites"] !== "undefined") {
            const testsuites: any = reportfile["testsuites"];
            return testsuites["testsuite"];
        }
        if (typeof reportfile["testsuite"] === "object") {
            return [reportfile["testsuite"]];
        }
        if (typeof reportfile["testsuite"] !== "undefined") {
            return reportfile["testsuite"];
        }
        throw new Error("No test suite found");
    };

    try {
        const result: TestCasesStats = {
            failed: 0,
            ignored: 0,
            passed: 0
        };

        const testsuiteArray = extractedTestSuite();
        if (typeof testsuiteArray !== "undefined") {
            result.ignored = sumBy(testsuiteArray, (testsuite: any) => {
                const testcaseArray: any[] = testsuite["testcase"];
                if (typeof testcaseArray === "undefined") {
                    console.log("no testcaseArray!");
                    console.log(JSON.stringify(reportfile));
                    return 0;
                }
                return testcaseArray.filter((testcase: any) => {
                    return typeof testcase["skipped"] !== "undefined" && testcase.skipped.length > 0;
                }).length;
            });
            result.passed = sumBy(testsuiteArray, (testsuite: any) => {
                const testcaseArray: any[] = testsuite["testcase"];
                if (typeof testcaseArray === "undefined") {
                    return 0;
                }
                return testcaseArray.filter((testcase: any) => {
                    return (typeof testcase["failure"] === "undefined" || testcase.failure.length === 0) &&
                        (typeof testcase["error"] === "undefined" || testcase.error.length === 0) &&
                        (typeof testcase["skipped"] === "undefined" || testcase.skipped.length === 0);
                }).length;
            });
            result.failed = sumBy(testsuiteArray, (testsuite: any) => {
                const testcaseArray: any[] = testsuite["testcase"];
                if (typeof testcaseArray === "undefined") {
                    return 0;
                }
                return testcaseArray.filter((testcase: any) => {
                    return (typeof testcase["failure"] !== "undefined" && testcase.failure.length > 0) ||
                        (typeof testcase["error"] !== "undefined" && testcase.error.length > 0);
                }).length;
            });
        } else {
            console.log("no testsuiteArray!");
            console.log(JSON.stringify(reportfile));
        }

        return result;
    } catch (e) {
        console.log("ERROR:");
        console.log(e);
        console.log(JSON.stringify(reportfile));
        throw e;
    }
};

export const allStats = (reportfiles: any[]) => {
    return reportfiles.map(stats);
};


export const combineStats = (all: TestCasesStats[]) => {
    return {
        failed: sumBy(all, "failed"),
        ignored: sumBy(all, "ignored"),
        passed: sumBy(all, "passed")
    };
};

export const addStatsToCommit = async (reportfiles: any[], commit: JunitResult): Promise<JunitResult> => {
    const ALL_STATS = allStats(reportfiles);
    const COMBINE_STATS = combineStats(ALL_STATS);
    commit.tests_passed = COMBINE_STATS.passed;
    commit.tests_ignored = COMBINE_STATS.ignored;
    commit.tests_failed = COMBINE_STATS.failed;
    return commit;
};