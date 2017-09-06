// http://eslint.org/docs/user-guide/configuring

module.exports = {
    "root": true,
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "plugins": ["html"],
    "rules": {
        "indent": ["error", 4, {
            "SwitchCase": 1
        }],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": ["error"]
    }
}
