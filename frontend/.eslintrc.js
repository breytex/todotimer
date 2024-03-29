module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "modules": true
    },
    "sourceType": "module"
  },

  "plugins": [
    "react", "prettier", "react-hooks"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jasmine": true
  },

  "extends": [
    "airbnb-base", "eslint:recommended", "plugin:react/recommended", "prettier", "prettier/react"
  ],

  "rules": {
    "semi": [
      2, "never"
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-no-bind": [
      "error", {
        "allowArrowFunctions": true,
        "allowBind": false,
        "ignoreRefs": true
      }
    ],
    "react/no-did-update-set-state": "error",
    "react/no-unknown-property": 0,
    "react/no-unused-prop-types": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "error",
    "prettier/prettier": [
      "error", {
        "semi": false,
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 120,

      }
    ],
    "no-console": 0,
    "import/prefer-default-export": 0,
    "react/display-name": 0
  }
}