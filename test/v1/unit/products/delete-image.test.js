jest.mock('infra/database/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}))
jest.mock('services/file/file-services', () => ({
  ...jest.requireActual('services/file/file-services'),
  uploadFile: jest.fn().mockResolvedValue({
    secure_url: 'https://fake.com/img.jpg',
    public_id: 'fake_public_id_123',
  }),
  deleteFromStorage: jest.fn().mockResolvedValue(true),
}))
import pool from 'infra/database/db'
import { Postproduct, Putproduct } from 'services/products/products-services'
import { deleteFromStorage } from 'services/file/file-services'

describe('delete cloudinary image when post returns 409', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('Postproduct call deleteFromStorage when insert failure per duplicity', async () => {
    pool.query.mockRejectedValueOnce({ code: '23505' })

    await expect(
      Postproduct(
        'nome',
        10,
        5,
        1,
        1,
        'desc',
        { filepath: '/fake/path.jpg' },
        'ADMIN'
      )
    ).rejects.toBeTruthy()

    expect(deleteFromStorage).toHaveBeenCalledWith('fake_public_id_123')
  })
  test('Putproduct call deleteFromStorage when insert failure per duplicity', async () => {
    pool.query.mockRejectedValueOnce({ code: '23505' })

    await expect(
      Putproduct(10, 'nome', 5, 1, 1, 1, 'desc', 'ADMIN', {
        filepath: '/fake/path.jpg',
      })
    ).rejects.toBeTruthy()

    expect(deleteFromStorage).toHaveBeenCalledWith('fake_public_id_123')
  })
})
