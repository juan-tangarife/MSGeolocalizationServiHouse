const express = require("express");
require('dotenv').config();
const routes = require("./routes/routes.js")
const {connectDB} = require("./database/dbConnection.js");
const {swaggerUi, swaggerDocs} = require("./middlewares/swagger.js")


const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "JSON inválido en el body"
        });
    }
    next();
});
const port = process.env.PORT || 3000;


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, '0.0.0.0',() => {
    console.log("Server running on:", port);
});
app.use('/api/geolocalization', routes);
connectDB();
