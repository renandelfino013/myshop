export async function verifyFile(file: File | null): Promise<boolean> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const magicnumbers = buffer.subarray(0, 8)

  const signatures = [
    Buffer.from([0xff, 0xd8, 0xff]), //jpeg
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), //png
  ]

  const isvalid = signatures.some((bytes) =>
    magicnumbers.subarray(0, bytes.length).equals(bytes)
  )

  if (!isvalid) return false
  return true
}
