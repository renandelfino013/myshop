import cloudinary from 'infra/cloudinary/cloudinary'
export async function verify_if_image_exist(public_id) {
  try {
    await cloudinary.api.resource(public_id)
    return false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error(error)
    return true
  }
}
