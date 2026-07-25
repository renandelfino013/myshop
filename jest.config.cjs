/* eslint-disable @typescript-eslint/no-require-imports */

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

const nextjest = require('next/jest')
const createjestConfig = nextjest({
  dir: '.',
})
const jestConfig = createjestConfig({
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testTimeout: 60000,
})
module.exports = jestConfig
