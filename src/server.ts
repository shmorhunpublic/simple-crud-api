import * as http from "http";
import { HttpMethod } from "./utils/http.js";
import { PATHS } from "./utils/paths.js";
import { msgs } from "./utils/messages.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from "./routes/user.routes.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const requestUrl = new URL(url || "", `http://${req.headers.host}`);
  const path = requestUrl.pathname;
  const userId = path.split("/").pop() || "";

  res.setHeader("Content-Type", "application/json");

  if (method === HttpMethod.GET && path === PATHS.users) {
    return getAllUsers(req, res);
  } else if (method === HttpMethod.GET && path.startsWith(PATHS.users)) {
    return getUserById(req, res, userId);
  } else if (method === HttpMethod.POST && path === PATHS.users) {
    return createUser(req, res);
  } else if (method === HttpMethod.PUT && path.startsWith(PATHS.users)) {
    return updateUserById(req, res, userId);
  } else if (method === HttpMethod.DELETE && path.startsWith(PATHS.users)) {
    return deleteUserById(req, res, userId);
  } else {
    res.writeHead(404);
    res.end(msgs.ENF);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
