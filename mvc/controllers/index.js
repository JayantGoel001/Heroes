var express = require('express');
var router = express.Router();
const getIndex = router.get('/', function(req, res, next) {
  res.render('index', { title: 'MongoDB' });
});

const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');

getHeroesIndex = function(req,res) {
    Hero.find((err,heroes)=>{
        if (err) {
            res.send({error:err});
        }
        // res.send(heroes);
        // console.log(heroes);
        res.render('heroes',{title:"Hall Of Heroes",heroes:heroes});
    });
}
getHeroesIndexForm = function(req,res) {
    res.render('create-a-hero',{title:"Create A Hero"})
}
createNewHero = function({body},res) {
    let hero = {
        name : body.name,
        description : body.desc,
        stats:{
            strength : body.strength,
            perception : body.perception,
            endurance : body.endurance,
            charisma : body.charisma,
            intelligence : body.intelligence,
            agility : body.agility,
            luck : body.luck,
        }
    }
    body.origin && (hero.origin = body.origin);
    Hero.create(hero,(err,newHero)=>{
        if (err) {
            return res.send({error : err});
        }
        // res.send(newHero);
        res.redirect('/heroes');
    });
}

module.exports = {
    getIndex,
    getHeroesIndex,
    getHeroesIndexForm,
    createNewHero
}
