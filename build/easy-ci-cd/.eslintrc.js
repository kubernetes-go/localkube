module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "prettier",
    "prettier/@typescript-eslint"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2017, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    jsx: true,
  },
  rules: {
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
  }
};
