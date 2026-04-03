import type { DependencyGroup, PackageManager } from "@alextheman/utility/internal";

import {
  getDependenciesFromGroup,
  getExpectedTgzName,
  getPackageJsonContents,
} from "@alextheman/utility/internal";
import { execa } from "execa";
import { temporaryDirectoryTask } from "tempy";

import path from "node:path";

import getInstallVersion from "src/safe-npm-dependency-global-install/getInstallVersion";

export interface SafeNpmDependencyGlobalInstallInputs {
  packageName: string;
  versionRange?: string;
  packageManager: PackageManager;
  dependencyGroup: DependencyGroup;
  strictVersionResolution: boolean;
  selfInstall: boolean;
}

async function safeNpmDependencyGlobalInstall({
  packageName,
  versionRange,
  packageManager,
  dependencyGroup,
  strictVersionResolution,
  selfInstall,
}: SafeNpmDependencyGlobalInstallInputs) {
  const runCommandAndLogToConsole = execa({ stdio: "inherit" });
  if (selfInstall) {
    await temporaryDirectoryTask(async (temporaryPath) => {
      console.info("Installing from the current repository...");
      await runCommandAndLogToConsole`${packageManager} pack --pack-destination ${temporaryPath}`;
      const tarballName = await getExpectedTgzName(process.cwd(), packageManager);

      const tarballPath = path.join(temporaryPath, tarballName);
      console.info(`Installing the tarball from ${tarballPath}`);
      await runCommandAndLogToConsole`${packageManager} install -g file:${tarballPath}`;

      const { stdout: installedVersion } = await execa`${packageName} --version`;
      console.info(`Installed ${packageName}@${installedVersion}`);
    });
    return;
  }

  const packageInfo = await getPackageJsonContents(process.cwd(), {
    strict: strictVersionResolution,
  });
  const dependencies = getDependenciesFromGroup(packageInfo ?? {}, dependencyGroup);

  const [installRange, logMessage] = getInstallVersion({
    dependencies,
    packageName,
    versionRange,
    strictVersionResolution,
  });

  console.info(logMessage);
  await runCommandAndLogToConsole`${packageManager} install -g ${packageName}@${installRange}`;
  const { stdout: installedVersion } = await execa`${packageName} --version`;
  console.info(`Installed ${packageName}@${installedVersion}`);
}

export default safeNpmDependencyGlobalInstall;
