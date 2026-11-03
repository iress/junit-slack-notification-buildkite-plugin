import {createRequire} from "module";
import {join} from "path";
import {describe, expect, it} from "@jest/globals";

describe("Jest glob dependencies", () => {
  it.each([
    "@jest/core",
    "@jest/reporters",
    "jest-config",
    "jest-runner",
    "jest-runtime",
    "jest-snapshot"
  ])("%s uses patched minimatch with compatible glob matching", dependency => {
    const fromJest = createRequire(require.resolve(dependency));
    const glob = fromJest("glob");
    const fromGlob = createRequire(fromJest.resolve("glob"));

    expect(fromGlob("minimatch/package.json").version).toBe("11.0.1");
    expect(glob.sync("reports/**/*.xml", {
      cwd: join(__dirname, "..")
    }).sort()).toEqual([
      "reports/sample-flat-file.xml",
      "reports/sample-structure-file.xml"
    ]);
  });
});
