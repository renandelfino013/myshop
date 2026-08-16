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

  if ((await usuario.status) == 201) {
    return [true, await usuario.json()]
  } else {
    return [false, await usuario.json()]
  }
}
const fakeuser = { user }
export default {
  fakeuser,
}
