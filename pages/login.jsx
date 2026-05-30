import styles from "../styles/login.module.css";

function login() {
  return (
    <main className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.form}>
        <div className={styles.cinput1}>
          <div className={styles.iconusername}></div>
          <input type="text" placeholder="Username" className={styles.input} />
        </div>
        <div className={styles.cinput2}>
          <div className={styles.iconpassword}></div>
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
          />
        </div>
        <button
          formAction="/login"
          method="post"
          type="submit"
          className={styles.button}
        >
          Login
        </button>
      </div>
    </main>
  );
}

export default login;
