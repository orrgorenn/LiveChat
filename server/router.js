const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.send('Server is up!');
});

router.get('/:imgName', (req, res) => {
    console.log(req.params['imgName'].split('=')[1]);
    var imgName = req.params['imgName'].split('=')[1];
    let imageURL = './images/' + imgName;
    if (imgName) {
        var img = fs.readFileSync(imageURL);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(img, 'binary');
    } else {
        res.send('hi');
    }
});

module.exports = router;