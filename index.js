const express = require("express");
const fs = require("fs");
const app = express();
const jsonParser = express.json();

const readyQR = require('./readyQr');
const tempQr = require('./tempQr');

const PORT = process.env.PORT || 5000;
const SITE_PATH = process.env.SITE_PATH || `http://localhost:${PORT}/`;
const filePath = "qr.json";
const readyFilePath = "qr-ready.json";

app.listen(PORT, function(){
    console.log(`server started on port ${PORT}...`);
});

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

app.use(express.static(__dirname + "/public"));

/////// ready qr`s

app.post('/api/qr/ready/:id',  jsonParser, readyQR.post);
app.get('/api/qr/ready/:id',  jsonParser, readyQR.get);
app.get("/api/qr/ready/", readyQR.getAll);
app.delete("/api/qr/ready/:id", jsonParser, readyQR.del);
app.delete("/api/qr/ready/", readyQR.delAll);

////// temp qr`s

app.post('/api/qr/:id', jsonParser, tempQr.post);
app.get("/api/qr/:id", tempQr.get);
app.get("/api/qr/", tempQr.getAll);
app.delete("/api/qr/:id", jsonParser, tempQr.del);
app.delete("/api/qr/", tempQr.delAll);
