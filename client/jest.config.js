module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/store/(.*)$": "<rootDir>/src/store/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)",
    "<rootDir>/src/**/*.(test|spec).(ts|tsx|js)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/setupTests.ts",
    "!src/**/*.stories.{ts,tsx}",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/build/",
    "<rootDir>/dist/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$|@heroicons|@headlessui))",
  ],
  moduleDirectories: ["node_modules", "src"],
  testTimeout: 10000,
};
