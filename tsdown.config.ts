import type { UserConfig } from "tsdown";
import packageInfo from "./package.json" with { type: "json" };

const ALL_THE_DEPENDENCIES_TO_BUNDLE_BECAUSE_GITHUB_ACTIONS_IS_GARBAGE = [
  ...Object.keys(packageInfo.dependencies),
  "@alextheman/utility/internal",
];

const config: Array<UserConfig> = [
  {
    entry: ["src/safe-npm-dependency-global-install/index.ts"],
    outDir: "actions/safe-npm-dependency-global-install/dist",
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
    deps: {
      alwaysBundle: ALL_THE_DEPENDENCIES_TO_BUNDLE_BECAUSE_GITHUB_ACTIONS_IS_GARBAGE,
    },
  },
];

export default config;
