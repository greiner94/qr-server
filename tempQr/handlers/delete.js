const fs = require("fs");
const filePath = "qr.json";

module.exports = function del(req, res) {
    const userId = req.params.id;

    let data = fs.readFileSync(filePath, "utf8");
    let qrArr = JSON.parse(data);

    const qrToDeleteArr = qrArr.filter((qrObj) => qrObj.userId === userId);
    const qrToLeftArr = qrArr.filter((qrObj) => qrObj.userId !== userId);

    if (qrToDeleteArr.length) {
        data = JSON.stringify(qrToLeftArr);
        fs.writeFileSync(filePath, data);

        const qrFileNamesArr = qrToDeleteArr.map((qr) => qr.fileName.split('/')[qr.fileName.split('/').length - 1]);
        qrFileNamesArr.forEach(fileName => {
            try {
                fs.unlinkSync('./public/' + fileName);
            } catch (err) {
                return res.status(500).send(err);
            }
        });

        res.send(qrToDeleteArr);
    } else {
        res.status(404).send();  
    }    														    
}; 