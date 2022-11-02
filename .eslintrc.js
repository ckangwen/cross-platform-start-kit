module.exports = {
  extends: ["@charrue/typescript", "plugin:prettier/recommended"],
  rules: {
    "import/no-unresolved": "off",
    camelcase: "off",
    "no-magic-numbers": "off",
    "no-shadow": "off",
    "no-console": "off",
    "no-param-reassign": "off",
    "class-methods-use-this": "off",
    "no-useless-constructor": "off",
    "array-callback-return": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
