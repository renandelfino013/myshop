/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const original = fs.readFileSync(
  path.join(__dirname, '../../v1/products/image-upload-test/files/foto.jpg')
)
const padding = Buffer.alloc(6 * 1024 * 1024 - original.length, 0)
const largeFile = Buffer.concat([original, padding])

fs.writeFileSync(
  path.join(
    __dirname,
    '../../v1/products/image-upload-test/files/foto-grande.jpg'
  ),
  largeFile
)
console.log('Arquivo gerado:', largeFile.length, 'bytes')
