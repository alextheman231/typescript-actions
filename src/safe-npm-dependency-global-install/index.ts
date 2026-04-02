import { getBooleanInput, getInput } from "@actions/core";
import { parseZodSchema } from "@alextheman/utility";
import { DependencyGroup, PackageManager } from "@alextheman/utility/internal";
import z from "zod";

import safeNpmDependencyGlobalInstall from "src/safe-npm-dependency-global-install/safeNpmDependencyGlobalInstall";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await safeNpmDependencyGlobalInstall({
    packageName: getInput("package_name", { required: true }),
    versionRange: getOptionalInput("version_range"),
    packageManager: parseZodSchema(
      z.enum(PackageManager),
      getOptionalInput("package_manager") ?? PackageManager.NPM,
    ),
    dependencyGroup: parseZodSchema(
      z.enum(DependencyGroup),
      getOptionalInput("dependency_group") ?? DependencyGroup.DEPENDENCIES,
    ),
    strictVersionResolution: getBooleanInput("strict_version_resolution"),
  });
})();
