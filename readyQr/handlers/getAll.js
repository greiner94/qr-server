const fs = require("fs");
const readyFilePath = "qr-ready.json";

module.exports = function getAll(req, res) {
    const content = fs.readFileSync(readyFilePath, "utf8");
    const qrArr = JSON.parse(content);
    res.send(qrArr);
};