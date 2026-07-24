import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("teste de get status da api", async () => {
  const res = await fetch("http://localhost:3000/api/v1/status/");
  expect(res.status).toBe(200);
  const data = await res.json();
  console.log(data);
  const edate = new Date(data.updated_at).toISOString();
  expect(edate).toBe(data.updated_at);
  console.log("data atualizada: ", edate);
  expect(data).toHaveProperty("status");
  expect(data).toHaveProperty("updated_at");
  expect(data).toHaveProperty("dependencies");
  expect(data.dependencies).toHaveProperty("database");
  expect(data.dependencies).toHaveProperty("max_connections");
  expect(data.dependencies).toHaveProperty("active_connections");
  expect(data.dependencies.active_connections).toBeLessThanOrEqual(10);
});
