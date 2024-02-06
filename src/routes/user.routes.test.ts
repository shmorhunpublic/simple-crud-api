import supertest from "supertest";
import { createServer } from "http";
// import { v4 as uuidv4 } from "uuid";

const app = createServer();

const request = supertest(app);

describe("API Tests", () => {
  // Declaring userId with a more specific type
  let userId = "";

  it("1. Get all records with a GET api/users request (an empty array is expected)", async () => {
    const response = await request.get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("2. A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
    const newUser = {
      username: "Test User",
      age: 30,
      hobbies: ["Reading", "Coding"],
    };
    const response = await request.post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe(newUser.username);
    userId = response.body.id; // Correctly typed as a string now
  });
  it("3. With a GET api/user/{userId} request, try to get the created record by its id (the created record is expected)", async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", userId);
  });

  it("4. Update the created record with a PUT api/users/{userId} request (a response containing an updated object with the same id is expected)", async () => {
    const updatedUser = {
      username: "Updated User",
      age: 31,
      hobbies: ["Gaming", "Coding"],
    };
    const response = await request
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe(updatedUser.username);
  });

  it("5. Delete the created object by id with a DELETE api/users/{userId} request (confirmation of successful deletion is expected)", async () => {
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  it("6. Try to get a deleted object by id with a GET api/users/{userId} request (expected answer is that there is no such object)", async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
  });
});
