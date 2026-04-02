import type { UserConfig } from "tsdown";
import packageInfo from "./package.json" with { type: "json" };

const config: Array<UserConfig> = [
  {
    entry: ["src/safe-npm-dependency-global-install/index.ts"],
    outDir: "actions/safe-npm-dependency-global-install/dist",
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
    deps: {
      alwaysBundle: [...Object.keys(packageInfo.dependencies)],
    },
  },
];

export default config;
