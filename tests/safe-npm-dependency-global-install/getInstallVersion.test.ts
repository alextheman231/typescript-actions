import { describe, expect, test } from "vitest";
import { dependencies } from "package.json" with { type: "json" };
import getInstallVersion, {
  ResolvedFromMessage,
} from "src/safe-npm-dependency-global-install/getInstallVersion";
import { DataError, VersionNumber } from "@alextheman/utility";

const VERSION_RANGE_FIXTURES: Array<string> = [
  `${new VersionNumber([1, 2, 3])}`,
  `^${new VersionNumber([5, 0, 0])}`,
  ">=2 <3",
  ">=2.9 <3.0",
  ">3.1.4 <4.2.0",
];

describe("getInstallVersion", () => {
  test.each<string>(VERSION_RANGE_FIXTURES)(
    "Uses the provided version range if provided (testing %s)",
    (versionRange) => {
      const [version, message] = getInstallVersion({
        dependencies,
        packageName: "test-package",
        versionRange,
      });
      expect(version).toBe(versionRange);
      expect(message).toContain(ResolvedFromMessage.WORKFLOW_INPUT);
    },
  );
  test.each<string>(VERSION_RANGE_FIXTURES)(
    "Uses the provided version range even if the dependencies includes the package we are looking for (testing %s)",
    (versionRange) => {
      const UTILITY_PACKAGE = "@alextheman/utility";
      expect(dependencies).toHaveProperty(UTILITY_PACKAGE);
      const [version, message] = getInstallVersion({
        dependencies,
        packageName: UTILITY_PACKAGE,
        versionRange,
      });
      expect(version).toBe(versionRange);
      expect(message).toContain(ResolvedFromMessage.WORKFLOW_INPUT);
    },
  );
  test("Uses the package.json version if no version range provided", () => {
    const UTILITY_PACKAGE = "@alextheman/utility";
    expect(dependencies).toHaveProperty(UTILITY_PACKAGE);
    const [version, message] = getInstallVersion({ dependencies, packageName: UTILITY_PACKAGE });
    expect(version).toBe(dependencies[UTILITY_PACKAGE]);
    expect(message).toContain(ResolvedFromMessage.PACKAGE_JSON);
  });
  test.each<false | undefined>([false, undefined])(
    "Uses latest if not in dependencies or version range input, and strict version resolution is %s",
    (strictVersionResolution) => {
      const [version, message] = getInstallVersion({
        dependencies,
        packageName: "invalid",
        strictVersionResolution,
      });
      expect(version).toBe("latest");
      expect(message).toContain(ResolvedFromMessage.FALLBACK);
    },
  );
  test("Throws a DataError if not in dependencies or version range input, and strict version resolution is true", () => {
    const error = DataError.expectError(() => {
      return getInstallVersion({
        dependencies,
        packageName: "invalid",
        strictVersionResolution: true,
      });
    });
    expect(error.data.packageName).toBe("invalid");
    expect(error.data.strictVersionResolution).toBe(true);
    expect(error.data.packageFoundInDependencies).toBe(false);
    expect(error.data.inputVersion).toBe(undefined);
  });
});
