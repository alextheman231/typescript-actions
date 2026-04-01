import { getBooleanInput, getInput } from "@actions/core";
import { DataError, parseZodSchema } from "@alextheman/utility";
import {
  DependencyGroup,
  PackageManager,
  getDependenciesFromGroup,
  getPackageJsonContents,
} from "@alextheman/utility/internal";
import { execa } from "execa";
import z from "zod";
//#region src/utility/getOptionalInput.ts
function getOptionalInput(name) {
  const value = getInput(name);
  return value === "" ? void 0 : value;
}
//#endregion
//#region src/safe-npm-dependency-global-install/index.ts
(async () => {
  const packageName = getInput("package_name", { required: true });
  const versionRange = getInput("version_range");
  const packageManager = parseZodSchema(
    z.enum(PackageManager),
    getOptionalInput("package_manager") ?? PackageManager.NPM,
  );
  const dependencyGroup = parseZodSchema(
    z.enum(DependencyGroup),
    getOptionalInput("dependency_group") ?? DependencyGroup.DEPENDENCIES,
  );
  const strict = getBooleanInput("strict_version_resolution");
  const dependencies = getDependenciesFromGroup(
    (await getPackageJsonContents(process.cwd(), { strict })) ?? {},
    dependencyGroup,
  );
  const runCommandAndLogToConsole = execa({ stdio: "inherit" });
  if (versionRange) {
    console.info(`Installing ${packageName}@${versionRange} (resolved from workflow input)`);
    await runCommandAndLogToConsole`${packageManager} install -g ${packageName}@${versionRange}`;
  } else if (packageName in dependencies) {
    console.info(
      `Installing ${packageName}@${dependencies[packageName]} (resolved from package.json)`,
    );
    await runCommandAndLogToConsole`${packageManager} install -g ${packageName}@${dependencies[packageName]}`;
  } else if (!strict) {
    console.info(
      `Installing ${packageName} at latest (fallback: not found in package.json and no version_range provided, strict=false)`,
    );
    await runCommandAndLogToConsole`${packageManager} install -g ${packageName}`;
  } else
    throw new DataError(
      {
        packageName,
        strictVersionResolution: strict,
        packageJsonVersion: dependencies[packageName],
        inputVersion: versionRange,
      },
      "VERSION_RESOLUTION_ERROR",
      `Could not resolve the version. Expected to find ${packageName} in package.json, or a version range input provided, but neither was found.`,
    );
})();
//#endregion
export {};
