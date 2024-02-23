import {allStats, combineStats, getStats, stats} from "../src/testcaseStats";
import {describe, expect, it} from "@jest/globals";

describe("Convert test cases statistics", () => {
    it("should calculate passed test with testcase stats", async () => {
        const testsuites = {
            "testsuites": {
                "$": {
                    "errors": "0",
                    "failures": "0",
                    "tests": "1"
                },
                "testsuite": [
                    {
                        "$": {
                            "errors": "0",
                            "failures": "0",
                            "hostname": "",
                            "id": "",
                            "name": "group.test1",
                            "package": "group",
                            "skipped": "3",
                            "tests": "1",
                            "time": "4.557",
                            "timestamp": ""
                        },
                        "testcase": [
                            {
                                "$": {
                                    "assertions": "7",
                                    "classname": "group.test1",
                                    "name": "group/test1 - Launch test1 page",
                                    "time": "4.557"
                                }
                            }
                        ]
                    }
                ]
            }
        };

        const actual = await stats(testsuites);

        expect(actual).toStrictEqual({passed: 1, ignored: 0, failed: 0});


    });

    it("should calculate no test with wrong testsuite", async () => {
        const testsuites = {
            "testsuites": {
                "$": {
                    "errors": "0",
                    "failures": "0",
                    "tests": "0"
                },
                "testsuite": "no an array"
            }
        };

        const actual = await stats(testsuites);

        expect(actual).toStrictEqual({passed: 0, ignored: 0, failed: 0});


    });

    it("should calculate no test with no testsuites", async () => {
        const testsuites = {
            "testsuites": {}
        };

        const actual = await stats(testsuites);

        expect(actual).toStrictEqual({passed: 0, ignored: 0, failed: 0});


    });

    it("should fail without testsuites", () => {
        const testsuites = {};

        expect(() => stats(testsuites))
            .toThrow();
    });

    it("should calculate failed test with testcase stats", async () => {
        const testsuites = {
            "testsuites": {
                "$": {
                    "errors": "0",
                    "failures": "1",
                    "tests": "1"
                },
                "testsuite": [
                    {
                        "$": {
                            "errors": "0",
                            "failures": "1",
                            "hostname": "",
                            "id": "",
                            "name": "group2.test2",
                            "package": "group2",
                            "skipped": "0",
                            "tests": "1",
                            "time": "179.4",
                            "timestamp": ""
                        },
                        "system-err": [
                            "a system-err error here"
                        ],
                        "testcase": [
                            {
                                "$": {
                                    "assertions": "196",
                                    "classname": "group2.test2",
                                    "name": "group2/test2 name",
                                    "time": "179.4"
                                },
                                "failure": [
                                    {
                                        "$": {
                                            "message": "1st failure msg"
                                        },
                                        "_": "at code.js:502:14"
                                    },
                                    {
                                        "$": {
                                            "message": "2nd failure msg"
                                        },
                                        "_": "at code.js:234:14"
                                    }
                                ],
                                "system-out": [
                                    "a system-out error here"
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        const actual = await stats(testsuites);

        expect(actual).toStrictEqual({passed: 0, ignored: 0, failed: 1});


    });

    it("should calculate skipped test with testcase stats", async () => {
        const testsuites = {
            "testsuites": {
                "$": {
                    "errors": "0",
                    "failures": "0",
                    "tests": "0"
                },
                "testsuite": [
                    {
                        "$": {
                            "errors": "0",
                            "failures": "0",
                            "hostname": "",
                            "id": "",
                            "name": "group3.test3",
                            "package": "register",
                            "skipped": "9",
                            "tests": "0",
                            "time": "0",
                            "timestamp": ""
                        },
                        "system-err": [
                            "a system-out error here"
                        ],
                        "testcase": [
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 1 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 2 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 3 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 4 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 5 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 6 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 7 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 8 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            },
                            {
                                "$": {
                                    "classname": "group3.test3",
                                    "name": "testcase 9 name"
                                },
                                "skipped": [
                                    ""
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        const actual = await stats(testsuites);

        expect(actual).toStrictEqual({passed: 0, ignored: 9, failed: 0});


    });

    it("should parse all JSON files with testcase stats", async () => {
        const testsuites = [
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "1"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group.test1",
                                "package": "group",
                                "skipped": "0",
                                "tests": "1",
                                "time": "4.557",
                                "timestamp": ""
                            },
                            "testcase": [
                                {
                                    "$": {
                                        "assertions": "7",
                                        "classname": "group.test1",
                                        "name": "testcase 1 name",
                                        "time": "4.557"
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "1",
                        "tests": "1"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "1",
                                "hostname": "",
                                "id": "",
                                "name": "group2.test2",
                                "package": "group2",
                                "skipped": "0",
                                "tests": "1",
                                "time": "179.4",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-out error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "assertions": "196",
                                        "classname": "group2.test2",
                                        "name": "testcase 1 name",
                                        "time": "179.4"
                                    },
                                    "failure": [
                                        {
                                            "$": {
                                                "message": "failure msg"
                                            },
                                            "_": "at location"
                                        },
                                        {
                                            "$": {
                                                "message": "failure msg"
                                            },
                                            "_": "at location"
                                        }
                                    ],
                                    "system-out": [
                                        "a system-out error here"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "0"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group3.test3",
                                "package": "register",
                                "skipped": "9",
                                "tests": "0",
                                "time": "0",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-err error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 1 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 2 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 3 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 4 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 5 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 6 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 7 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 8 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase 9 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "0"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group4.test4",
                                "package": "group4",
                                "skipped": "2",
                                "tests": "0",
                                "time": "0",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-err error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "classname": "group4.test4",
                                        "name": "testcase 1 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group4.test4",
                                        "name": "testcase 2 name"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        const actual = allStats(testsuites);

        expect(actual).toStrictEqual([
            {
                "failed": 0,
                "ignored": 0,
                "passed": 1
            },
            {
                "failed": 1,
                "ignored": 0,
                "passed": 0
            },
            {
                "failed": 0,
                "ignored": 9,
                "passed": 0
            },
            {
                "failed": 0,
                "ignored": 2,
                "passed": 0,
            }
        ]);


    });

    it("should parse all JSON files with testcase stats even if there is no Suite", async () => {
        const fileWithNoTestsuites = [
            {
                "testsuite": {
                    "$": {
                        "name": "group5.test5",
                        "package": "",
                        "timestamp": "2021-03-31T13:50:26",
                        "id": "0",
                        "hostname": "9ebcadfd370b",
                        "tests": "737",
                        "errors": "0",
                        "failures": "7",
                        "time": "3.372"
                    },
                    "properties": [
                        {
                            "property": [
                                {
                                    "$": {
                                        "name": "browser.fullName",
                                        "value": "Mozilla/5.0"
                                    }
                                }
                            ]
                        }
                    ],
                    "testcase": [
                        {
                            "$": {
                                "name": "testcase 1 name",
                                "time": "0.026",
                                "classname": "classname here"
                            }
                        },
                        {
                            "$": {
                                "name": "testcase 2 name",
                                "time": "0.026",
                                "classname": "classname here"
                            },
                            "failure": [
                                {
                                    "_": "Error Unexpected",
                                    "$": {
                                        "type": ""
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuite": {
                    "$": {
                        "name": "group6.test6",
                        "package": "",
                        "timestamp": "2021-03-01T16:22:57",
                        "id": "0",
                        "hostname": "1d1b166f2581",
                        "tests": "875",
                        "errors": "0",
                        "failures": "0",
                        "time": "16.157"
                    },
                    "properties": [
                        {
                            "property": [
                                {
                                    "$": {
                                        "name": "browser.fullName",
                                        "value": "Mozilla/5.0"
                                    }
                                }
                            ]
                        }
                    ],
                    "testcase": [
                        {
                            "$": {
                                "name": "testcase 1 name",
                                "time": "0.018",
                                "classname": "classname here"
                            }
                        },
                    ]
                }
            }
        ];
        const actual = allStats(fileWithNoTestsuites);
        expect(actual).toStrictEqual([
            {
                "failed": 1,
                "ignored": 0,
                "passed": 1
            },
            {
                "failed": 0,
                "ignored": 0,
                "passed": 1
            }
        ]);
    });
});

describe("Combine all statistics", () => {
    it("should add all results together", async () => {
        const all = [
            {passed: 1, ignored: 0, failed: 0},
            {passed: 1, ignored: 0, failed: 1},
            {passed: 1, ignored: 1, failed: 0}
        ];

        const actual = combineStats(all);

        expect(actual).toStrictEqual({passed: 3, ignored: 1, failed: 1});

    });
});

describe("Add Statistic to Commit", () => {
    it("should add all results together", async () => {
        const testsuites = [
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "1"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group.test1",
                                "package": "group",
                                "skipped": "0",
                                "tests": "1",
                                "time": "4.557",
                                "timestamp": ""
                            },
                            "testcase": [
                                {
                                    "$": {
                                        "assertions": "7",
                                        "classname": "group.test1",
                                        "name": "group/test1 - Launch test1 page",
                                        "time": "4.557"
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "1",
                        "tests": "1"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "1",
                                "hostname": "",
                                "id": "",
                                "name": "group2.test2",
                                "package": "group2",
                                "skipped": "0",
                                "tests": "1",
                                "time": "179.4",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-err error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "assertions": "196",
                                        "classname": "group2.test2",
                                        "name": "testcase name here",
                                        "time": "179.4"
                                    },
                                    "failure": [

                                        {
                                            "$": {
                                                "message": "failure msg"
                                            },
                                            "_": "at location"
                                        },
                                        {
                                            "$": {
                                                "message": "failure msg"
                                            },
                                            "_": "at location"
                                        }
                                    ],
                                    "system-out": [
                                        "a system-out error here"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "0"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group3.test3",
                                "package": "register",
                                "skipped": "9",
                                "tests": "0",
                                "time": "0",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-err error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group3.test3",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "testsuites": {
                    "$": {
                        "errors": "0",
                        "failures": "0",
                        "tests": "0"
                    },
                    "testsuite": [
                        {
                            "$": {
                                "errors": "0",
                                "failures": "0",
                                "hostname": "",
                                "id": "",
                                "name": "group4.test4",
                                "package": "system",
                                "skipped": "2",
                                "tests": "0",
                                "time": "0",
                                "timestamp": ""
                            },
                            "system-err": [
                                "a system-err error here"
                            ],
                            "testcase": [
                                {
                                    "$": {
                                        "classname": "group4.test4",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                },
                                {
                                    "$": {
                                        "classname": "group4.test4",
                                        "name": "testcase name here"
                                    },
                                    "skipped": [
                                        ""
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        const actual = await getStats(testsuites);

        expect(actual).toStrictEqual({
            tests_failed: 1,
            tests_ignored: 11,
            tests_passed: 1
        });
    });
});
