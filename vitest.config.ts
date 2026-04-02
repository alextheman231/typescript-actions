import { UserProjectConfigExport } from "vitest/config";

const vitestConfig: UserProjectConfigExport = {
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/tests/**/*.test.ts"],
  },
};

export default vitestConfig;
