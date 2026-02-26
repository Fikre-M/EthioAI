module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/types/**",
    "!src/config/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "src/services/AuthService.ts": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageDirectory: "coverage",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src'],
//   testMatch: [
//     '**/__tests__/**/*.ts',
//     '**/?(*.)+(spec|test).ts'
//   ],
//   transform: {
//     '^.+\\.ts$': 'ts-jest',
//   },
//   collectCoverageFrom: [
//     'src/**/*.ts',
//     '!src/**/*.d.ts',
//     '!src/types/**',
//     '!src/scripts/**',
//   ],
//   coverageDirectory: 'coverage',
//   coverageReporters: [
//     'text',
//     'lcov',
//     'html'
//   ],
//   setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
//   testTimeout: 30000,
//   maxWorkers: 1, // Run tests sequentially to avoid database conflicts
// };
