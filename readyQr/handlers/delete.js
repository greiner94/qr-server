const fs = require("fs");
const readyFilePath = "qr-ready.json";

module.exports = function del(req, res) {
    console.log('delete ready qr');

    const userId = req.params.id;
    const imageId = req.body.id;

    let data = fs.readFileSync(readyFilePath, "utf8");
    let qrArr = JSON.parse(data);

    let qrIndex;
    let fullfilePath;

    for (let i = 0; i < qrArr.length; i++) {
        if (qrArr[i].userId == userId && qrArr[i].id == imageId) {
            fullfilePath = qrArr[i].fileName;
            qrIndex = i;
        } 
    }

    if (qrIndex > -1) {
        const qr = qrArr.splice(qrIndex, 1)[0];

        const fileName = fullfilePath.split('/')[fullfilePath.split('/').length - 1];

        data = JSON.stringify(qrArr);

        fs.writeFileSync(readyFilePath, data);

        try {
            fs.unlinkSync('./public/' + fileName);

            res.send(qr);

        } catch (err) {
            return res.status(500).send(err);
        }
        
    } else {
        res.status(404).send();  
    }    														    
}; 