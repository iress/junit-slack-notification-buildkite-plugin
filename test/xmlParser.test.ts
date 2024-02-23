import {parseFiles} from "../src/xmlParser";
import {describe, expect} from "@jest/globals";

describe("Parser test read slack-notification/reports folder", () => {
  it("should parse XML files with testcase results", async () => {
    const actual = await parseFiles("**/*.xml");
    expect(actual).toEqual([
      {
        "testsuite": {
          "$": {
            "name": "testsuite name",
            "package": "",
            "timestamp": "2021-03-31T13:50:26",
            "id": "0",
            "hostname": "9ebcadfd370b",
            "tests": "3",
            "errors": "0",
            "failures": "1",
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
                "name": "testcase name",
                "time": "0.026",
                "classname": "testcase classname"
              }
            },
            {
              "$": {
                "name": "testcase name",
                "time": "0.014",
                "classname": "testcase classname"
              }
            },
            {
              "$": {
                "name": "testcase name",
                "time": "0.026",
                "classname": "testcase classname"
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
          ],
          "system-out": [
            "a system-err error here"
          ],
          "system-err": [
            ""
          ]
        }
      },
      {
        "testsuites": {
          "$": {
            "errors": "0",
            "failures": "1",
            "tests": "2"
          },
          "testsuite": [
            {
              "$": {
                "name": "testsuite name",
                "errors": "0",
                "failures": "1",
                "hostname": "",
                "id": "",
                "package": "register",
                "skipped": "1",
                "tests": "2",
                "time": "128.2",
                "timestamp": ""
              },
              "testcase": [
                {
                  "$": {
                    "name": "testcase 1 name (failed)",
                    "classname": "testcase classname",
                    "time": "128.2",
                    "assertions": "8"
                  },
                  "failure": [
                    {
                      "_": "failure body",
                      "$": {
                        "message": "failure message"
                      }
                    }
                  ],
                  "system-out": [
                    "system-out body"
                  ]
                },
                {
                  "$": {
                    "name": "testcase 2 name (skipped)",
                    "classname": "testcase classname"
                  },
                  "skipped": [
                    ""
                  ]
                },
                {
                  "$": {
                    "name": "testcase 3 name (pass)",
                    "classname": "testcase classname",
                    "time": "21.68",
                    "assertions": "36"
                  }
                }
              ]
            }
          ]
        }
      }
    ]);
  });
});

