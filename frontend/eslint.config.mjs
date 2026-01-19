import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["jest.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    }
  },
  {
    files: ["src/components/Sidebar.tsx", "src/components/AuthGuard.tsx", "src/app/login/page.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": "off",
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
