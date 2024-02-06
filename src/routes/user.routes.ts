import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuid } from "uuid";
import { User } from "../models/user.model.js";
import { errors, msgs } from "../utils/messages.js";
import { isValidUuid } from "../utils/uuid.js";

export const users: User[] = [];

export async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  try {
    res.writeHead(200);
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.writeHead(500);
    res.end(errors.ISERetrieve);
  }
}

export async function getUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
  try {
    if (!isValidUuid(userId)) {
      res.writeHead(400);
      res.end(errors.IID);
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (user) {
      res.writeHead(200);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404);
      res.end(msgs.UNF);
    }
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.writeHead(500);
    res.end(errors.ISERetrieve);
  }
}

export async function createUser(req: IncomingMessage, res: ServerResponse) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      const newUser: Partial<User> = JSON.parse(body);
      // Validate required fields
      if (
        !newUser.username ||
        typeof newUser.age !== "number" ||
        !Array.isArray(newUser.hobbies)
      ) {
        res.writeHead(400);
        res.end(errors.MF);
        return;
      }
      // Generate ID for the new user
      const userWithId: User = { ...newUser, id: uuid() } as User;
      users.push(userWithId);
      res.writeHead(201);
      res.end(JSON.stringify(userWithId));
    } catch (error) {
      console.error("Error in createUser:", error);
      res.writeHead(500);
      res.end(errors.ISECreate);
    }
  });
}

export async function updateUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
  if (!isValidUuid(userId)) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Invalid userId" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      try {
        const updatedUserData: Partial<User> = JSON.parse(body);

        if (updatedUserData.id && updatedUserData.id !== userId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Cannot change user ID" }));
          return;
        }

        const updatedUser: User = {
          ...users[userIndex],
          ...updatedUserData,
          id: userId,
        };
        users[userIndex] = updatedUser;
        res.writeHead(200);
        res.end(JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error in updateUserById:", error);
        res.writeHead(400);
        res.end(errors.IRB);
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "User not found" }));
    }
  });
}

export async function deleteUserById(
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) {
  if (!isValidUuid(userId)) {
    res.writeHead(400);
    res.end(errors.IID);
    return;
  }

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
