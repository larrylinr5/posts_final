module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    indent: [2, 2],
    quotes: [2, "double"],
    semi: [2, "always"],
    "no-use-before-define": [2, "nofunc"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "comma-spacing": [
      2,
      {
        before: false,
        after: true,
      },
    ],
    "key-spacing": [
      1,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    "import/first": [0]
  },
};
