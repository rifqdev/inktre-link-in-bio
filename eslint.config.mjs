import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disallow all console statements (console.log, console.error, etc.)
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Allow 'any' type selectively (it's sometimes necessary in complex scenarios)
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);

export default eslintConfig;
