import validationtoken from "utils/validators/validationtoken";

export async function reqValidation(email, session_version, token) {
  if (token) {
    await validationtoken(email, session_version);
  }
  return null;
}
