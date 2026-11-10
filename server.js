
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const jsonServerPath = fileURLToPath(
  new URL('./node_modules/json-server/lib/bin.js', import.meta.url),
)

const dbPath = fileURLToPath(
  new URL('./db.json', import.meta.url),
)

const port = process.env.PORT || '5000'

const server = spawn(
  process.execPath,
  [
    jsonServerPath,
    dbPath,
    '--host',
    '0.0.0.0',
    '--port',
    port,
  ],
  {
    stdio: 'inherit',
  },
)

server.on('error', (error) => {
  console.error('Failed to start JSON Server:', error)
  process.exit(1)
})

server.on('exit', (code) => {
  process.exit(code ?? 0)
})
