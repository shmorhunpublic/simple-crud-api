import * as http from "http";
import { HttpMethod } from "./utils/http.js";
import { PATHS } from "./utils/paths.js";
import { errors, msgs } from "./utils/messages.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from "./routes/user.routes.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const requestUrl = new URL(url || "", `http://${req.headers.host}`);
  const path = requestUrl.pathname;
  const userId = path.split("/").pop() || "";

  res.setHeader("Content-Type", "application/json");

  try {
    if (method === HttpMethod.GET && path === PATHS.users) {
      await getAllUsers(req, res);
    } else if (method === HttpMethod.GET && path.startsWith(PATHS.users)) {
      await getUserById(req, res, userId);
    } else if (method === HttpMethod.POST && path === PATHS.users) {
      await createUser(req, res);
    } else if (method === HttpMethod.PUT && path.startsWith(PATHS.users)) {
      await updateUserById(req, res, userId);
    } else if (method === HttpMethod.DELETE && path.startsWith(PATHS.users)) {
      await deleteUserById(req, res, userId);
    } else {
      res.writeHead(404);
      res.end(msgs.ENF);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.writeHead(500);
    res.end(errors.ISEUnexpected);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
