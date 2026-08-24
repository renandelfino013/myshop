export default function regexemail(email) {
  let allowed_emails = [
    "@",
    "hotmail.com",
    "hotmail.com.br",
    "gmail.com.br",
    "gmail.com",
    "outlook.com",
    "outlook.com.br",
  ];
  let regexEmail = new RegExp(
    `^[a-zA-Z0-9._%+-]+@(${allowed_emails.map((domain) => domain.replace(".", "\\.")).join("|")})$`,
  );
  if (!regexEmail.test(email)) {
    return false;
  } else {
    return true;
  }
}
