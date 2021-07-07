let express = require('express');
let router = express.Router();

const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.getIndex);

router.get('/squads',indexCtrl.getSquadsIndex);
router.get('/create-squad',indexCtrl.getSquadsForm);
router.post('/create-squad',indexCtrl.createSquad);

router.get('/heroes', indexCtrl.getHeroIndex);
router.get('/create-hero', indexCtrl.getHeroForm);
router.post('/create-hero', indexCtrl.createNewHero);

router.post('/delete-hero/:id', indexCtrl.deleteHero);

router.get('/update-hero/:id', indexCtrl.getUpdateForm);
router.post('/update-hero/:id', indexCtrl.updateHero);

router.get('/reset',indexCtrl.reset);

module.exports = router;