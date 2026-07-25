import pool from "utils/db";
import orchestrator from "test/orchestrator.js";
import createuser from "test/hooks/userfortests";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await createuser.fakeuser.user(
    "jaestalogadoteste@gmail.com",
    "aDSADAASa",
    "123dsDSA",
  );
});

async function cleanuser(email) {
  await pool.query("SELECT id, nome, email, senha, role FROM usuarios");
  await pool.query("DELETE FROM usuarios WHERE email = $1", [email]);
}
let email = "test3fdf@gmail.com";

describe("teste register/users", () => {
  test("register test from myshop", async () => {
    const register = await fetch("http://localhost:3000/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "TESTEAUTOMATIZADOdsa",
        email: email,
        senha: "1234ddsa4",
      }),
    });
    expect(register.status).toBe(201);
    let respbody = await register.json();
    if (respbody.error) {
      console.log(respbody.error);
    }
  });

  test("create user with incorrect informations", async () => {
    email = "testetest@";
    const register = await fetch("http://localhost:3000/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "aa",
        email: email,
        senha: "123ds",
      }),
    });
    let body = await register.json();
    console.log("TEST : create user with incorrect information:", body);
    expect(body).toHaveProperty("error");
    expect(register.status).toBe(401);
    console.log(
      "TEST : create user with incorrect information:",
      register.status,
    );
  });
  afterEach(async () => {
    await cleanuser(email);
  });

  let emailforlooged = "jaestalogadoteste@gmail.com";

  test("create acount with looged email", async () => {
    const register = await fetch("http://localhost:3000/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "aDSADAASa",
        email: emailforlooged,
        senha: "123dsDSA",
      }),
    });
    let body = await register.json();
    expect(register.status).toBe(400);
    console.error(body.error);
    expect(body).toHaveProperty("error");
  });

  test("tryng register user with invalid email", async () => {
    const register = await fetch("http://localhost:3000/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: "aDSADAASa",
        email: "@.ddsadm",
        senha: "123dsDSA",
      }),
    });
    let body = await register.json();
    expect(register.status).toBe(401);
    expect(body).toHaveProperty("error");
    console.log(body.error);
  });
});
