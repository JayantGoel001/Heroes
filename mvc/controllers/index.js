var express = require('express');
var router = express.Router();
const getIndex = router.get('/', function(req, res, next) {
  res.render('index', { title: 'MongoDB' });
});

const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const Squad = mongoose.model('Squad');


let data = require("../../Default-Heroes");
let heroData = data.heroes;

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
    Squad.find((err,squads)=>{
        if(err){
            return res.send({error:err});
        }
        res.render("create-a-hero",{title:"Create a Hero",squads:squads});
    });
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

deleteHero = function({params},res) {
    Hero.findByIdAndRemove(params.heroid,(err,hero)=>{
        if (err) {
            return res.send({error:err});
        }
        res.redirect('/heroes');
    });
}

getUpdateForm = function({params},res) {
    Hero.findById(params.heroid,(err,hero)=>{
        if(err){
            return res.send({error:err});
        }
        Squad.find((err,squads)=>{
            if(err){
                return res.send({error:err});
            }
            res.render("update-hero",{title:"Update Hero",hero:hero,squads:squads});
        });
    });
}

updateHero = function({params,body},res) {
    Hero.findById(params.heroid,(err,hero)=>{
        if (err) {
            return res.send({error:err});
        }
        hero.name = body.name;
        hero.description = body.desc;
        hero.origin = body.origin;
        hero.stats.strength = body.strength;
        hero.stats.perception = body.perception;
        hero.stats.endurance = body.endurance;
        hero.stats.charisma = body.charisma;
        hero.stats.intelligence = body.intelligence;
        hero.stats.agility = body.agility;
        hero.stats.luck = body.luck;

        hero.save((err,updatedHero)=>{
            if (err) {
                res.send({error:err});
            }
            res.redirect("/heroes");
        })
    });
}

reset = function(req,res) {
    Hero.deleteMany({},(err,info)=>{
        if(err){
            res.send({error:err});
        }
        Hero.insertMany(heroData,(err,info)=>{
            if(err){
                res.send({error:err});
            }
            res.redirect('/heroes');
        })
    })
}

getSquadIndex = function(req,res) {
    Squad.find((err,squads)=>{
        if (err) {
            res.send({error:err});
        }
        res.render("squads",{title:"Super Squads",squads:squads});
    });
}
getSquadForm = function(req,res) {
    res.render("create-squad",{title:"Create a Super Squad"});
}
createSquad = function({body},res) {
    let squad = {name:body.name };
    body.hq && (squad.hq=body.hq);
    squad.hq || (squad.hp = "Unknown");

    Squad.create(squad,(err)=>{
        if (err) {
            res.send({error:err});
        }
        res.redirect("/squads");
    });
}

deleteSquad = function({params},res) {
    Squad.findByIdAndRemove(params.squadid,(err)=>{
        if (err) {
            res.send({error:err});
        }
        res.redirect("/squads");
    })
}

module.exports = {
    getIndex,
    getHeroesIndex,
    getHeroesIndexForm,
    createNewHero,
    deleteHero,
    getUpdateForm,
    updateHero,
    reset,
    getSquadIndex,
    getSquadForm,
    createSquad,
    deleteSquad
}
