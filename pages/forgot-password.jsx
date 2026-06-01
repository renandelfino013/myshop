import styles from "../styles/forgotpassword.module.css";

function forgotPassword() {
  return (
    <main className={styles.container}>
      <div className={styles.divtext}>
        <h1>Esqueci minha senha</h1>
        <p>
          Insira seu email para receber as instruções de recuperação de senha.
        </p>
      </div>
      <form className={styles.form}>
        <input
          type="email"
          placeholder="Digite seu email"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Enviar
        </button>
      </form>
      <footer className={styles.footer}>
        <p>© 2026 MyShop. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

export default forgotPassword;
