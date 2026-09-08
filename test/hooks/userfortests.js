async function user(email, nome, senha) {
  const usuario = await fetch('http://localhost:3000/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: nome,
      email: email,
      senha: senha,
    }),
  })
  const body = await usuario.json()
  if ((await usuario.status) == 201) {
    return [true, await body]
  } else {
    return [false, await body]
  }
}
const fakeuser = { user }
export default {
  fakeuser,
}
