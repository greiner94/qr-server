const fs = require("fs");
const filePath = "qr.json";

module.exports = function delAll(req, res) {
    fs.writeFileSync(filePath, '[]');
    fs.readdirSync('./public/').forEach(f => {
        if (f.endsWith('.png')) {
            fs.unlinkSync(`./public/${f}`);
        }
    });
    
    let data = fs.readFileSync(filePath, "utf8");
    res.send(data);
};