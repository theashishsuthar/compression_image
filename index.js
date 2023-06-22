const express = require("express");
const app = express();
const port = 3000;

const routes = require("./route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
