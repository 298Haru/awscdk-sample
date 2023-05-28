module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
  //  "airbnb",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": "off", // TODO: on
    "@typescript-eslint/no-empty-interface": "off", // TODO: on
    "@typescript-eslint/no-use-before-define": "off", // TODO: on
    "@typescript-eslint/no-unused-vars": "off", // TODO: on
    "@typescript-eslint/no-parameter-properties": "off",  // NOTE: これはそのままでOK。
    "@typescript-eslint/no-non-null-assertion": "off", // TODO: on。test codeだけ許可したい
    "@typescript-eslint/explicit-member-accessibility": "off", // TODO: on
    "@typescript-eslint/no-namespace": "off", // TODO: 要検討
    "@typescript-eslint/no-explicit-any": "off" // TODO: 要検討.どうしてもanyにしなければならない場所

    // eslint-disable-next-line @typescript-eslint/no-var-requires 強制的に無視しているLineがあるので要チェック。
  },
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
}
