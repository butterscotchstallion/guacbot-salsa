var express = require('express');
var router = express.Router();

/* GET plugin messages */
router.get('/plugin-messages', function(req, res) {
  res.render('plugin-messages/index', { title: 'Plugin Messages' });
});

module.exports = router;
