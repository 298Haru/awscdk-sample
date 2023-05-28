module.exports = {
  // roots: ['<rootDir>/test'],
  // testMatch: ['**/*.test.ts'],
  testMatch: ['**/__tests__/**/*Test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
