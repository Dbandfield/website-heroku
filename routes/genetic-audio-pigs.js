var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/worlds/genetic-audio-pigs/index.html', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/../public/worlds/genetic-audio-pigs/index.html'));
});

module.exports = router;
