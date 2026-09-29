import orchestrator from 'test/orchestrator.js'
import fs from 'fs'
import path from 'path'
import { generates_Users_And_catch_Their_Cookies } from 'test/v1/helper/setup/generates_Users_And_catch_Their_Cookies'

const apiUrl = 'http://localhost:3000/api/v1'
const FILES_DIR = path.join(
  __dirname,
  '../',
  '../',
  'products',
  'image-upload-test',
  'files'
)

let usersetup

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  usersetup = await generates_Users_And_catch_Their_Cookies()
})

function buildForm(fileOnDisk, filename = fileOnDisk) {
  const form = new FormData()
  form.append(
    'image',
    new Blob([fs.readFileSync(path.join(FILES_DIR, fileOnDisk))], {
      type: 'image/jpeg',
    }),
    filename
  )
  return form
}

async function postMe(body, { cookie = usersetup.commonUser.cookie } = {}) {
  const headers = cookie ? { cookie } : {}
  const response = await fetch(`${apiUrl}/users/me`, {
    method: 'POST',
    headers,
    body,
  })
  const responsebody = await response.json()
  return { responsebody, response }
}

async function getMe() {
  const response = await fetch(`${apiUrl}/users/me`, {
    headers: { cookie: usersetup.commonUser.cookie },
  })
  return response.json()
}

describe('POST /users/me happy path', () => {
  test('image upload replaces the previous image', async () => {
    const first = await postMe(buildForm('foto.jpg'))
    expect(first.response.status).toBe(200)
    expect(first.responsebody.message).toBe('picture saved')

    const before = await getMe()

    const second = await postMe(buildForm('foto.jpg', 'file.jpg'))
    expect(second.response.status).toBe(200)
    expect(second.responsebody.success).toBe(true)

    const after = await getMe()
    expect(after.data[0].image).toMatch(/^https:\/\/res\.cloudinary\.com\//)
    expect(after.data[0].image).not.toBe(before.data[0].image)
  }, 30000)
})

describe('POST /users/me invalid files', () => {
  test('pdf content with fake image/jpeg mimetype returns 415', async () => {
    const { responsebody, response } = await postMe(
      buildForm('teste.pdf', 'foto.jpg')
    )
    expect(response.status).toBe(415)
    expect(responsebody.success).toBe(false)
  })

  test('without file returns 415', async () => {
    const { responsebody, response } = await postMe(new FormData())
    expect(response.status).toBe(415)
    expect(responsebody.success).toBe(false)
  })

  test('image bigger than 5mb returns 400', async () => {
    const { responsebody, response } = await postMe(
      buildForm('foto-grande.jpg', 'big-picture.jpg')
    )
    expect(response.status).toBe(400)
    expect(responsebody.success).toBe(false)
  })

  test('invalid upload does not change the current image', async () => {
    const before = await getMe()
    await postMe(buildForm('foto-grande.jpg', 'foto.jpg'))
    const after = await getMe()
    expect(after.data[0].image).toBe(before.data[0].image)
  })
})

describe('POST /users/me auth', () => {
  test('without cookie returns 401', async () => {
    const { response } = await postMe(buildForm('foto.jpg'), { cookie: null })
    expect(response.status).toBe(401)
  })

  test('invalid token returns 401', async () => {
    const { response } = await postMe(buildForm('foto.jpg'), {
      cookie: 'invalidtoken',
    })
    expect(response.status).toBe(401)
  })
})
