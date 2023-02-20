const fs = require("fs");
const filePath = "qr.json";

module.exports = function getAll(req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const qrArr = JSON.parse(content);
    res.send(qrArr);
};