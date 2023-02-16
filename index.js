const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require ('express-fileupload');
const app = express();
const jsonParser = express.json();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const SITE_PATH = process.env.SITE_PATH || path.join('http://localhost:5000/');
  
app.use(express.static(__dirname + "/public"));
app.use(fileUpload({}));
app.use(cors({
    origin: ['https://fancy-pie-2565e2.netlify.app', '*'],
    credentials: true,
  }));

const filePath = "qr.json";

app.listen(PORT, function(){
    console.log(`server started on port ${PORT}...`);
});

app.post('/api/qr/:id', jsonParser, (req, res) => {
    console.log('post');
    const userId = req.params.id;
    const descr = req.body.descr;
    const textString = req.body.textString;
    const bgColor = req.body.bgColor;
    const color = req.body.color;
    const correctionLevel = req.body.correctionLevel || 'L';
    const width = req.body.width || 220;
    const fileName = uuidv4() + '.png';

    if (!req.body || !userId || !textString || !descr) {
        return res.sendStatus(400);
    } 

    let qr = {userId, descr, fileName: SITE_PATH + fileName};

    let data = fs.readFileSync(filePath, "utf8");
    let qrArr = JSON.parse(data);
    const id = qrArr.length ? Math.max.apply(Math, qrArr.map((obj) => obj.id)) : 0;
    qr.id = id + 1;

    qrArr.push(qr);
    data = JSON.stringify(qrArr);
    fs.writeFileSync(filePath, data);

    try {
        QRCode.toFile(__dirname + '/public/' + fileName, textString, {
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
});
   
app.get("/api/qr/:id", function(req, res) {
    console.log('get');
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
});

app.delete("/api/qr/:id", jsonParser, function(req, res) {
       
    const userId = req.params.id;
    const fileName = req.body.fileName;
    let data = fs.readFileSync(filePath, "utf8");
    let qrArr = JSON.parse(data);
    let index = -1;

    qrArr.forEach((qr, ind) => {
        if (qr.userId == userId && qr.fileName == fileName) {
            index = ind;
        }
    });

    if(index > -1){
        const qr = qrArr.splice(index, 1)[0];

        data = JSON.stringify(qrArr);
        fs.writeFileSync(filePath, data);
        res.send(qr);

        try {
            fs.unlinkSync(fileName);
        } catch(err) {
            return res.status(500).send(err);
        }
    }
    else{
        res.status(404).send();
    }
});

app.get("/api/qr/", function(req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const qrArr = JSON.parse(content);
    res.send(qrArr);
});

app.delete("/api/qr/", function(req, res) {

    fs.writeFileSync(filePath, '[]');
    fs.readdirSync(__dirname + '/public/').forEach(f => {
        if (!f.endsWith('.html')) {
            fs.unlinkSync(__dirname + `/public/${f}`);
        }
    });
    
    let data = fs.readFileSync(filePath, "utf8");
    res.send(data);
});
