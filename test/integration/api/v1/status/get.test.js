import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const data = await response.json();
  const parsedUpdatedAt = new Date(data.updated_at).toISOString();

  expect(response.status).toBe(200);
  expect(data.updated_at).toBeDefined();
  expect(data.updated_at).toEqual(parsedUpdatedAt);
  expect(data.database).toBeDefined();
  expect(data.database.version).toBe("16.0");
  expect(typeof data.database.max_connections).toBe("number");
  expect(typeof data.database.used_connections).toBe("number");
  expect(data.database.used_connections).toBeLessThanOrEqual(
    data.database.max_connections,
  );
});
