import type { DependencyGroup, PackageManager } from "@alextheman/utility/internal";

import { getDependenciesFromGroup, getPackageJsonContents } from "@alextheman/utility/internal";
import { execa } from "execa";

import getInstallVersion from "src/safe-npm-dependency-global-install/getInstallVersion";

export interface SafeNpmDependencyGlobalInstallInputs {
  packageName: string;
  versionRange?: string;
  packageManager: PackageManager;
  dependencyGroup: DependencyGroup;
  strictVersionResolution: boolean;
}

async function safeNpmDependencyGlobalInstall({
  packageName,
  versionRange,
  packageManager,
  dependencyGroup,
  strictVersionResolution,
}: SafeNpmDependencyGlobalInstallInputs) {
  const packageInfo = await getPackageJsonContents(process.cwd(), {
    strict: strictVersionResolution,
  });
  const dependencies = getDependenciesFromGroup(packageInfo ?? {}, dependencyGroup);

  const runCommandAndLogToConsole = execa({ stdio: "inherit" });

  const [installRange, logMessage] = getInstallVersion({
    dependencies,
    packageName,
    versionRange,
    strictVersionResolution,
  });

  console.info(logMessage);
  await runCommandAndLogToConsole`${packageManager} install -g ${packageName}@${installRange}`;
}

export default safeNpmDependencyGlobalInstall;
