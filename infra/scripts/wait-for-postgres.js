import { exec } from 'node:child_process'

function waitforpostgres() {
  const port = process.env.DB_PORT || 5432
  const user = process.env.POSTGRES_USER || 'postgres'
  exec(
    `docker exec my_database pg_isready -h localhost -p ${port} -U ${user}`,
    handlereturn
  )
  function handlereturn(error, stdout) {
    let up = stdout.search('accepting connections')
    if (up !== -1) {
      console.log('\n\n🟢 postgres aceitando conexões!!\n\n')
      return
    } else {
      process.stdout.write('.')
      waitforpostgres()
    }
  }
}
console.log('Up Database 🐳')

waitforpostgres()
