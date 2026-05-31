import styles from "../styles/login.module.css";

function login() {
  function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const senha = event.target.senha.value;
    console.log("Email:", email);
    console.log("Senha:", senha);
    fetch("/api/index", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }
  return (
    <main className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit} className={styles.form}>
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
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <a href="/forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </a>
      </div>
    </main>
  );
}

export default login;
