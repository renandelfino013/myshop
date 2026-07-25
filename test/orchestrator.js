import retry from 'async-retry'

async function waitForAllServices() {
  await waitForWebServer()
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 1000,
    minTimeout: 1000,
    maxTimeout: 1000,
  })
}

async function fetchStatusPage(bail, tryNumber) {
  console.log(tryNumber)

  const response = await fetch('http://localhost:3000/api/v1/status')
  if (!response.ok) {
    throw new Error('Servidor não respondeu ainda')
  }
  const body = await response.json()
  console.log('✅ Servidor vivo:', body)
  return body
}

export default {
  waitForAllServices,
}
