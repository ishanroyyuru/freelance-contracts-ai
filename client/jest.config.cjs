// client/jest.config.cjs
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      // point to a tsconfig that includes your tests
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};
