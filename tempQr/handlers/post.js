const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const fs = require("fs");

const PORT = process.env.PORT || 5000;
const SITE_PATH = process.env.SITE_PATH || `http://localhost:${PORT}/`;
const filePath = "qr.json";

module.exports = function post(req, res) {
    console.log('post temp qr');
    const userId = req.params.id;
    const descr = req.body.descr;
    const textString = req.body.textString;
    const type = req.body.type;
    const bgColor = req.body.bgColor;
    const color = req.body.color;
    const correctionLevel = req.body.correctionLevel || 'L';
    const width = req.body.width || 220;
    const fileName = uuidv4() + '.png';

    if (!req.body || !userId || !textString || !descr || !type) {
        return res.sendStatus(400);
    } 

    let qr = {userId, type, descr, fileName: SITE_PATH + fileName};

    let data = fs.readFileSync(filePath, "utf8");
    let qrArr = JSON.parse(data);
    const id = qrArr.length ? Math.max.apply(Math, qrArr.map((obj) => obj.id)) : 0;
    qr.id = id + 1;

    qrArr.push(qr);
    data = JSON.stringify(qrArr);
    fs.writeFileSync(filePath, data);

    try {
        QRCode.toFile('./public/' + fileName, textString, {
            color: {
                dark: color,
                light: bgColor
              },
              width: width,
              errorCorrectionLevel: correctionLevel,
        }, (err) => {
            if (err) {
                throw err;
            }
        });
    } catch(err) {
        return res.status(500).send(err);
    }
    res.send(qr);
};