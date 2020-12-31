const express = require("express");
const app = express(); // initialize express instance

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Server running on port 5000
app.listen(5000);
