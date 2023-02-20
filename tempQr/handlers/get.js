const fs = require("fs");
const filePath = "qr.json";

module.exports = function get(req, res) {
    console.log('get temp qr');
    const userId = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const qrArr = JSON.parse(content);

    const qrList = qrArr.filter((qr) => qr.userId == userId);

    if(qrList.length){
        res.send(qrList);
    }
    else{
        res.status(404).send();
    }
};