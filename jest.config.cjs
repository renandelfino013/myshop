/* eslint-disable @typescript-eslint/no-require-imports */

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: '.' })

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testTimeout: 60000,
  moduleNameMapper: {
    '^/utils/(.*)$': '<rootDir>/utils/$1',
  },
})

module.exports = jestConfig
