const fs = require("fs");
const readyFilePath = "qr-ready.json";

module.exports = function delAll(req, res) {
    fs.writeFileSync(readyFilePath, '[]');
    fs.readdirSync('./public/').forEach(f => {
        if (f.endsWith('.png')) {
            fs.unlinkSync(`./public/${f}`);
        }
    });
    
    let data = fs.readFileSync(readyFilePath, "utf8");
    res.send(data);
};