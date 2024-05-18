/** @type {import('eslint').Linter.Config} */
module.exports = {
   root: true,
   parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: { jsx: true },
      project: ["tsconfig.json"],
   },
   env: {
      browser: true,
      commonjs: true,
      es6: true,
   },
   ignorePatterns: ["!**/.server", "!**/.client"],

   // Base config
   extends: ["eslint:recommended"],

   overrides: [
      // React
      {
         files: ["**/*.{js,jsx,ts,tsx}"],
         plugins: ["react", "jsx-a11y", "sort-react-dependency-arrays"],
         extends: [
            "plugin:react/recommended",
            "plugin:react/jsx-runtime",
            "plugin:react-hooks/recommended",
            "plugin:jsx-a11y/recommended",
            "plugin:drizzle/recommended",
            "plugin:tailwindcss/recommended",
         ],
         settings: {
            tailwindcss: {
               callees: ["clsx", "cn"],
               classRegex: "lass(Name)?$",
            },
            react: {
               version: "detect",
            },
            formComponents: ["Form"],
            linkComponents: [
               { name: "Link", linkAttribute: "to" },
               { name: "NavLink", linkAttribute: "to" },
            ],
            "import/resolver": {
               typescript: {},
            },
         },
         rules: {
            "sort-react-dependency-arrays/sort": "error",
            "drizzle/enforce-delete-with-where": ["error", { drizzleObjectName: "db" }],
            "react/prop-types": "off",
         },
      },

      // Typescript
      {
         files: ["**/*.{ts,tsx}"],
         plugins: ["@typescript-eslint", "import"],
         parser: "@typescript-eslint/parser",
         settings: {
            "import/internal-regex": "^~/",
            "import/resolver": {
               node: {
                  extensions: [".ts", ".tsx"],
               },
               typescript: {
                  alwaysTryTypes: true,
               },
            },
         },
         extends: [
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/strict-type-checked",
            "plugin:@typescript-eslint/stylistic-type-checked",
            "plugin:import/recommended",
            "plugin:import/typescript",
         ],
         rules: {
            "@typescript-eslint/no-confusing-void-expression": ["off"],
            "@typescript-eslint/no-misused-promises": ["off"],
            "@typescript-eslint/consistent-type-definitions": ["off"],
            "@typescript-eslint/only-throw-error": ["off"],
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
         },
      },

      // Node
      {
         files: [".eslintrc.cjs"],
         env: {
            node: true,
         },
      },
   ],
};
