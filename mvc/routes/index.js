let express = require('express');
let router = express.Router();

const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.getIndex);
router.get('/heroes', indexCtrl.getHeroIndex);

router.get('/create-hero', indexCtrl.getHeroForm);
router.post('/create-hero', indexCtrl.createNewHero);

router.post('/delete-hero/:id', indexCtrl.deleteHero);

router.get('/update-hero/:id', indexCtrl.getUpdateForm);
router.post('/update-hero/:id', indexCtrl.updateHero);

module.exports = router;