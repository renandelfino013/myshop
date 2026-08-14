import styles from "styles/resetpassword.module.css";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
function ResetPassword() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  if (!key) {
    return (
      <main className={styles.container}>
        <div className={styles.divtext}>
          <h1>Link de redefinição inválido</h1>
          <p>O link de redefinição de senha é inválido ou expirou.</p>

          <Link href="/forgot-password/" className={styles.button}>
            Solicitar novo link
          </Link>
        </div>
        <footer className={styles.footer}>
          <p>© 2026 MyShop. Todos os direitos reservados.</p>
        </footer>
      </main>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newpassword !== confirmPassword) {
      alert("As senhas não coincidem. Por favor, tente novamente.");
      return;
    }
    try {
      const response = await fetch("/api/v1/rede-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, newpassword }),
      });
      if (response.ok) {
        router.push("https://myshop-murex-iota.vercel.app");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.divtext}>
        <div className={styles.textd}>
          <h1>Redefinir Senha</h1>
          <p>Insira sua nova senha para redefinir sua senha.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <p className={styles.p}>Senha</p>
            <input
              type="password"
              name="newPassword"
              placeholder="Digite sua nova senha"
              className={styles.input}
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className={styles.p}>Confirmar senha</p>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirme sua nova senha"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className={styles.button}>
              Redefinir Senha
            </button>
          </form>
          {confirmPassword && newpassword !== confirmPassword && (
            <p className={styles.errorsenha}>
              As senhas não coincidem. Por favor, tente novamente.
            </p>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <p>© 2026 MyShop. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
export default ResetPassword;
