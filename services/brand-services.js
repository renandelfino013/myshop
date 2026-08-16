import {
  FindAllBrands,
  FindBrandById,
  FindBrandByName,
  InsertNewBrand,
} from 'models/marcas/marcas'

function NotFoundError(message) {
  const error = new Error(message)
  error.status = 404
  return error
}
function ForbiddenError(message) {
  const error = new Error(message)
  error.status = 403
  return error
}

function ValidationError(message) {
  const error = new Error(message)
  error.status = 400
  return error
}

export async function getallbrands() {
  try {
    return await FindAllBrands()
  } catch (error) {
    throw new Error('Error fetching brands: ' + error.message)
  }
}

export async function getbrandbyid(id) {
  const brand = await FindBrandById(id)
  console.log(brand)
  if (!brand || brand.length === 0) {
    throw NotFoundError('Brand not found')
  }
  return brand
}
export async function getbrandbyname(name) {
  const brand = await FindBrandByName(name)
  if (!brand || brand.length === 0) {
    throw new NotFoundError('Brand not found')
  }
  return brand
}

export async function createbrand(name, role) {
  if (role !== 'ADMIN') {
    throw ForbiddenError('User does not have permission to create a brand')
  } else if (!name) {
    throw ValidationError('Brand name is required')
  }
  const existingBrand = await FindBrandByName(name)
  if (existingBrand.length > 0) {
    throw ValidationError('Brand already exists')
  }
  return InsertNewBrand(name)
}
