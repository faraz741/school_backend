const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/users");
const admin = require("./routes/admin");


const app = express();
const cors = require("cors");
const http = require("http");

app.use(cors());
// app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/", user);
app.use("/admin", admin);
app.set('view engine', 'ejs');
app.set('view', './controller/view');


app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*", "http://localhost:3000", {
        reconnect: true,
    });
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Accept, X-Custom-Header,Authorization"
    );
    res.setHeader("Content-Type", "text/plain");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    } else {
        return res.send({ success: "0", message: "Hello World" });
    }
});

app.listen(3000, function() {
    console.log("Node app is running on port 3000");
});

module.exports = app;