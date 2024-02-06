import * as http from "http";
import { v4 as uuid } from "uuid";
import { User } from "./models/user.model.js";
import { HttpMethod } from "./utils/http.js";
import { PATHS } from "./utils/paths.js";
import { msgs } from "./utils/messages.js";
const PORT = process.env.PORT || 4000;
const users: User[] = [];

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, url } = req;
    const requestUrl = new URL(url || "", `http://${req.headers.host}`);
    const path = requestUrl.pathname;

    // Set response headers
    res.setHeader("Content-Type", "application/json");

    // Handle GET request for all users
    if (method === HttpMethod.GET && path === PATHS.users) {
      res.writeHead(200);
      res.end(JSON.stringify(users));
    }

    // Handle GET request for a specific user by ID
    else if (method === HttpMethod.GET && path.startsWith(PATHS.users)) {
      const userId = path.split("/").pop();
      const user = users.find((u) => u.id === userId);

      if (user) {
        res.writeHead(200);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404);
        res.end(msgs.UNF);
      }
    }

    // Handle POST request to create a new user
    else if (method === HttpMethod.POST && path === "/api/users") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const newUser = JSON.parse(body);
          newUser.id = uuid();
          users.push(newUser);
          res.writeHead(201);
          res.end(JSON.stringify(newUser));
        } catch (error) {
          res.writeHead(400);
          res.end(msgs.IJF);
        }
      });
    }

    // Handle PUT request to update a user by ID
    else if (method === HttpMethod.PUT && path.startsWith(PATHS.users)) {
      const userId = path.split("/").pop();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const updatedUser = JSON.parse(body);
            users[userIndex] = { ...users[userIndex], ...updatedUser };
            res.writeHead(200);
            res.end(JSON.stringify(users[userIndex]));
          } catch (error) {
            res.writeHead(400);
            res.end(msgs.IJF);
          }
        });
      } else {
        res.writeHead(404);
        res.end(msgs.UNF);
      }
    }

    // Handle DELETE request to delete a user by ID
    else if (method === HttpMethod.DELETE && path.startsWith(PATHS.users)) {
      const userId = path.split("/").pop();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404);
        res.end(msgs.UNF);
      }
    }

    // Handle other requests
    else {
      res.writeHead(404);
      res.end(msgs.ENF);
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
