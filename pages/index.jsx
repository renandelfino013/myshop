import { useState } from "react";
import styles from "../styles/login.module.css";

function Login() {
  const [estado, setEstado] = useState(false);
  const [register, setRegister] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const senha = event.target.senha.value;
    const nome = event.target.nome?.value;

    if (register) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        });

        if (!response.ok) {
          alert("Erro ao registrar. Tente novamente.");
          return;
        }

        const data = await response.json();
        console.log("Registro bem-sucedido:", data);
        localStorage.setItem("token", data.token);
      } catch (error) {
        console.error("Erro de rede:", error);
        alert("Erro de rede. Tente novamente mais tarde.");
      }
    } else {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
          if ([400, 401, 404].includes(response.status)) {
            setEstado(true);
          } else {
            alert("Erro no login. Tente novamente mais tarde.");
          }
          return;
        }

        const data = await response.json();
        console.log("Login bem-sucedido:", data);
        localStorage.setItem("token", data.token);
        setEstado(false);
      } catch (error) {
        console.error("Erro de rede:", error);
        alert("Erro de rede. Tente novamente mais tarde.");
      }
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.image}></div>

      <div className={styles.form}>
        <div className={styles.switch}>
          <p className={styles.p} onClick={() => setRegister(false)}>
            Login
          </p>
          <p className={styles.p} onClick={() => setRegister(true)}>
            Register
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {register ? (
            <>
              <div className={styles.cinput1}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Nome de usuário"
                  name="nome"
                />
              </div>
              <div className={styles.cinput1}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Email"
                  name="email"
                />
              </div>
              <div className={styles.cinput1}>
                <input
                  type="password"
                  placeholder="Senha"
                  name="senha"
                  className={styles.input}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.cinput1}>
                <div className={styles.iconusername}></div>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  id="email"
                  className={styles.input}
                />
              </div>
              <div className={styles.cinput2}>
                <div className={styles.iconpassword}></div>
                <input
                  type="password"
                  placeholder="Password"
                  name="senha"
                  id="senha"
                  className={styles.input}
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.button}>
            {register ? "Register" : "Login"}
          </button>
        </form>

        {estado && !register && (
          <p className={styles.error}>
            Invalid email or password. Please try again.
          </p>
        )}

        {!register && (
          <a href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </a>
        )}
      </div>
    </main>
  );
}

export default Login;
