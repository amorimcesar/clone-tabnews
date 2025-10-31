import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import jestPlugin from "eslint-plugin-jest";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js"],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "infra/migrations/**",
  ]),
]);

export default eslintConfig;
