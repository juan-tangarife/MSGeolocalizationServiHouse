const express = require("express");
require('dotenv').config();
const routes = require("./routes/routes.js")

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log("Server running on:", port);
});
app.use(routes);