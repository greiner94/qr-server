const fs = require("fs");
const readyFilePath = "qr-ready.json";

module.exports = function get(req, res)  {
    console.log('get ready qr');

    const userId = req.params.id;
    const content = fs.readFileSync(readyFilePath, "utf8");
    const qrArr = JSON.parse(content);

    const qrList = qrArr.filter((qr) => qr.userId == userId);

    if(qrList.length){
        res.send(qrList);
    }
    else{
        res.status(404).send();
    }
};