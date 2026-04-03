import { getBooleanInput, getInput } from "@actions/core";
import { parseZodSchema } from "@alextheman/utility";
import { DependencyGroup, PackageManager } from "@alextheman/utility/internal";
import z from "zod";

import safeNpmDependencyGlobalInstall from "src/safe-npm-dependency-global-install/safeNpmDependencyGlobalInstall";
import getOptionalInput from "src/utility/getOptionalInput";

(async () => {
  await safeNpmDependencyGlobalInstall({
    packageName: getInput("package-name", { required: true }),
    versionRange: getOptionalInput("version-range"),
    packageManager: parseZodSchema(
      z.enum(PackageManager),
      getOptionalInput("package-manager") ?? PackageManager.NPM,
    ),
    dependencyGroup: parseZodSchema(
      z.enum(DependencyGroup),
      getOptionalInput("dependency-group") ?? DependencyGroup.DEPENDENCIES,
    ),
    strictVersionResolution: getBooleanInput("strict-version-resolution"),
    selfInstall: getBooleanInput("self-install"),
  });
})();
