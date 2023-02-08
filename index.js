const express = require("express");
const path = require("path");
const fs = require("fs");
const fileUpload = require ('express-fileupload');
const app = express();
const jsonParser = express.json();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 5000;
  
app.use(express.static(__dirname + "/public"));
app.use(fileUpload({}));
const filePath = "qr.json";

app.listen(PORT, function(){
    console.log(`server started on port ${PORT}...`);
    console.log(path.resolve("/public"));
    console.log(path.resolve(__dirname, "/public"));
    console.log(__dirname + "/public");
});

app.post('/api/qr/:id', jsonParser, (req, res) => {
    console.log('post');
    const userId = req.params.id;
    const descr = req.body.descr;
    const textString = req.body.textString;
    const bgColor = req.body.bgColor;
    const color = req.body.color;
    const fileName = uuidv4() + '.png';

    if (!req.body || !userId || !textString || !descr) {
        return res.sendStatus(400);
    } 

    let qr = {userId, descr, fileName};

    let data = fs.readFileSync(filePath, "utf8");
    let qrArr = JSON.parse(data);
    const id = qrArr.length ? Math.max.apply(Math, qrArr.map((obj) => obj.id)) : 0;
    qr.id = id + 1;

    qrArr.push(qr);
    data = JSON.stringify(qrArr);
    fs.writeFileSync(filePath, data);

    try {
        QRCode.toFile(__dirname + `/public/${fileName}`, textString, {
            color: {
                dark: color,
                light: bgColor
              }
        }, (err) => {
            if (err) {
                throw err;
            }
        });
    } catch(err) {
        return res.status(500).send(err);
    }

    res.send(__dirname + `/public/${fileName}`);
});
   
app.get("/api/qr/:id", function(req, res) {
    console.log('get');
    const userId = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const qrArr = JSON.parse(content);

    const qrList = qrArr.filter((qr) => qr.userId == userId)
                        .map((qr) => {
                            return {
                                ...qr,
                                fileName: `${__dirname}/public/${qr.fileName}`,
                            };
                        });

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
            fs.unlinkSync(__dirname + `/public/${fileName}`);
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
    fs.readdirSync(__dirname + '/public/').forEach(f => fs.unlinkSync(__dirname + `/public/${f}`));
    
    let data = fs.readFileSync(filePath, "utf8");
    res.send(data);
});
