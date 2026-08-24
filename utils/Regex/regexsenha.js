export default function regexsenha(senha) {
  const regex = new RegExp("^(?=.*[A-Z]).{4,}$");

  return regex.test(senha);
}
