const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: '.' })

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^services/(.*)$': '<rootDir>/services/$1',
  },

  testTimeout: 60000,
  modulePathIgnorePatterns: ['generateuseradmin.test.js'],
})

module.exports = jestConfig
