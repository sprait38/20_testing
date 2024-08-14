module.exports = {
  transform: {
    '\\.js$': 'babel-jest',
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  testEnvironment: 'jsdom',
};
