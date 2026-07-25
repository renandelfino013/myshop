import styles from "/styles/forgotpassword.module.css";
import { useState } from "react";

function ForgotPassword() {
  let [estado, setEstado] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setEstado(true);
    const email = e.target.email.value;
    try {
      await fetch("/api/v1/rede-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };
  {
    if (estado) {
      return (
        <main className={styles.container_estado}>
          <div className={styles.divtext_estado}>
            <h1>Email enviado</h1>
            <p>
              Se o email fornecido estiver registrado, você receberá um email
              com as instruções para redefinir sua senha.
            </p>
          </div>
        </main>
      );
    }
  }

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

export default ForgotPassword;
