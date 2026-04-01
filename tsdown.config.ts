import type { UserConfig } from "tsdown";

const config: Array<UserConfig> = [
  {
    entry: ["src/safe-npm-dependency-global-install/index.ts"],
    outDir: "actions/safe-npm-dependency-global-install/dist",
    format: ["esm"],
    dts: true,
    clean: true,
    fixedExtension: false,
  },
];

export default config
