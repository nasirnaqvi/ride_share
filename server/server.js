const express = require('express');
const app = express();

app.get("/api", (req, res) => {
  res.json({ users: ["User 1", "User 2", "User 3"] });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});