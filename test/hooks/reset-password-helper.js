import { findresetkey } from 'models/users/users.js'

export async function requestResetPassword(email) {
  const response = await fetch('http://localhost:3000/api/v1/rede-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  return response
}

export async function getResetKey(email) {
  const resetKeys = await findresetkey(email)

  if (resetKeys.length === 0) {
    throw new Error('Reset key not found')
  }

  return resetKeys[0].key
}

export async function resetPassword(key, password) {
  return await fetch(`http://localhost:3000/api/v1/rede-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      newpassword: password,
    }),
  })
}
