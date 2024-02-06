import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuid } from "uuid";
import { User } from "../models/user.model.js";
import { msgs } from "../utils/messages.js";

export const users: User[] = [];

export function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200);
  res.end(JSON.stringify(users));
}

export function getUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.writeHead(200);
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404);
    res.end(msgs.UNF);
  }
}

export function createUser(req: IncomingMessage, res: ServerResponse) {
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

export function updateUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      try {
        const updatedUser = JSON.parse(body);
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        res.writeHead(200);
        res.end(JSON.stringify(users[userIndex]));
      } catch (error) {
        res.writeHead(400);
        res.end(msgs.IJF);
      }
    } else {
      res.writeHead(404);
      res.end(msgs.UNF);
    }
  });
}

export function deleteUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
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
