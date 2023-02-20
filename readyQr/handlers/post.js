const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const PORT = process.env.PORT || 5000;
const SITE_PATH = process.env.SITE_PATH || `http://localhost:${PORT}/`;
const readyFilePath = "qr-ready.json";

module.exports = function post(req, res) {
    console.log('post ready qr');

    const userId = req.params.id;
    const type = req.body.type;
    const descr = req.body.descr;
    const dataUrl = req.body.dataUrl;

    if (!userId|| !dataUrl || !descr || !type) {
        return res.sendStatus(400);
    } 

    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = dataUrl.match(regex);
    const ext = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');
    const fileName = uuidv4() + '.' + ext;
    fs.writeFileSync('public/' + fileName, buffer);

    let qr = {userId, type, descr, fileName: SITE_PATH + fileName};

    let data = fs.readFileSync(readyFilePath, "utf8");
    let qrArr = JSON.parse(data);
    const id = qrArr.length ? Math.max.apply(Math, qrArr.map((obj) => obj.id)) : 0;
    qr.id = id + 1;

    qrArr.push(qr);
    data = JSON.stringify(qrArr);
    fs.writeFileSync(readyFilePath, data);
    
    res.send(qr);
};