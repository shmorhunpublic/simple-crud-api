export const msgs = {
  UNF: JSON.stringify({ message: "User not found" }),
  IJF: JSON.stringify({ message: "Invalid JSON format" }),
  ENF: JSON.stringify({ message: "Endpoint not found" }),
};

export const errors = {
  UNF: JSON.stringify({ error: "User not found" }),
  IID: JSON.stringify({ error: "Invalid userId" }),
  MF: JSON.stringify({ error: "Missing required fields" }),
  IRB: JSON.stringify({ error: "Invalid request body" }),
  ISECreate: JSON.stringify({
    error: "Internal Server Error: Unable to create user.",
  }),
  ISERetrieve: JSON.stringify({
    error: "Internal Server Error: Unable to retrieve users.",
  }),
  ISEUnexpected: JSON.stringify({
    error: "Internal Server Error: An unexpected error occurred.",
  }),
};
