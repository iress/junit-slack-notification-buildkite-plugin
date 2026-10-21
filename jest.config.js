module.exports = {
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.json"
    }]
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node"
};