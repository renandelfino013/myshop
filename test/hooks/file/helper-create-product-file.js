import fs from 'fs'

const apiUrl = 'http://localhost:3000/api/v1'

export async function createProduct({
  token,
  name,
  price = '299.90',
  stock = '15',
  categoryId,
  markId,
  desc = 'Produto de teste',
  imagePath,
  imageMimeType = 'image/jpeg',
  imageFilename = 'teste.jpg',
}) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', price)
  formData.append('stock', stock)
  formData.append('categoryId', String(categoryId))
  formData.append('markId', String(markId))
  formData.append('desc', desc)

  if (imagePath) {
    formData.append(
      'image',
      new Blob([fs.readFileSync(imagePath)], { type: imageMimeType }),
      imageFilename
    )
  }

  const response = await fetch(`${apiUrl}/produtos`, {
    method: 'POST',
    headers: { cookie: `${token}` },
    body: formData,
  })

  const body = await response.json()
  return { status: response.status, body }
}
