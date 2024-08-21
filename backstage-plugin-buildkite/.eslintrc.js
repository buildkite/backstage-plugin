const baseConfig = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'no-console': off,
  },
}
