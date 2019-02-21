const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
const clientEnv = require('react-scripts/config/env.js')(process.env.PUBLIC_URL || '')

const outFile = `./public/env.js`
const content = `window.ENV = ${JSON.stringify(clientEnv.raw)}`

try {
  fs.writeFileSync(outFile, content, 'utf8')
  console.log('Wrote client environment to', outFile)
} catch (err) {
  console.error('Error while writing client environment file:', err.message)
  process.exit(1)
}