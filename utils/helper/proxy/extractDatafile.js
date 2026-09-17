export async function ValidateAndExtractDatafile(request) {
  const formdata = await request.formData();

  const file = (() => {
    for (const valor of formdata.values()) {
      if (valor instanceof File) {
        return valor;
      }
    }
  })();

  if (request.method == "PUT" && !file) return [true, { nofile: true }];
  else if (!file) return [false];
  const namefile = file.name;
  const filesize = file.size;
  const mimetype = file.type;

  const buffer = Buffer.from(await file.arrayBuffer());
  const magicnumbers = buffer.subarray(0, 8);

  const signatures = [
    Buffer.from([0xff, 0xd8, 0xff]), //jpeg
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), //png
  ];

  const isvalid = signatures.some((bytes) =>
    magicnumbers.subarray(0, bytes.length).equals(bytes),
  );

  if (isvalid) return [true, { namefile, filesize, mimetype }];
  else return [false];
}
