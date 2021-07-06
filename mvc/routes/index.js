let express = require('express');
let router = express.Router();

const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.getIndex);

module.exports = router;
