const isCi = !!process.env.CI;

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: isCi,
};
