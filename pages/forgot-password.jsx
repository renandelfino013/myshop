import styles from "../styles/forgotpassword.module.css";

function forgotPassword() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await fetch("/api/rede-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.divtext}>
        <h1>Esqueci minha senha</h1>
        <p>
          Insira seu email para receber as instruções de recuperação de senha.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
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
