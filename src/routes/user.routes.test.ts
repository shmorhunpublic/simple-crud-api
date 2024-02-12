import supertest from "supertest";
import { IncomingMessage, Server, ServerResponse, createServer } from "http";
import { v4 as uuidv4 } from "uuid";

const app = createServer();

const request = supertest(app);
const testTimeout = 5000;
describe("API Tests", () => {
  let userId = uuidv4();
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll((done) => {
    server = app.listen(() => done());
  }, testTimeout);

  afterAll((done) => {
    server.close(() => done());
  }, testTimeout);

  it(
    "1. Get all records with a GET api/users request (an empty array is expected)",
    async () => {
      const response = await request.get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    },
    testTimeout
  );

  it(
    "2. A new object is created by a POST api/users request (a response containing newly created record is expected)",
    async () => {
      const newUser = {
        username: "Test User",
        age: 30,
        hobbies: ["Reading", "Coding"],
      };
      const response = await request.post("/api/users").send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.username).toBe(newUser.username);
      userId = response.body.id;
    },
    testTimeout
  );
  it(
    "3. With a GET api/user/{userId} request, try to get the created record by its id (the created record is expected)",
    async () => {
      const response = await request.get(`/api/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", userId);
    },
    testTimeout
  );
});
