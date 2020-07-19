module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(.*).js$': '$1',
  },
  testPathIgnorePatterns: ['<rootDir>/out/']
};
