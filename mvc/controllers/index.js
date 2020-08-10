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
let squadData = data.squads;

function getOverall(hero) {
        let {
            strength:s,
            perception:p,
            endurance:e,
            charisma:c,
            intelligence:int,
            agility:a,
            luck:l} = hero.stats;
        let arr = [s, p, e, c, int, a, l];
        let overall = arr.reduce((a, b) => a + b, 0);
        return overall;
}
getHeroesIndex = function(req,res) {
    Hero.find({},null,{lean:true},(err,heroes)=>{
        if (err) {
            res.send({error:err});
        }
        // res.send(heroes);
        // console.log(heroes);
        for (var i = 0; i < heroes.length; i++) {
            heroes[i].overall = getOverall(heroes[i]);
        }
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
    body.squad && (hero.squad = body.squad);
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

        hero.squad = undefined;
        body.squad && (hero.squad = body.squad);

        hero.save((err,updatedHero)=>{
            if (err) {
                res.send({error:err});
            }
            res.redirect("/heroes");
        })
    });
}

reset = function(req,res) {
    let p1 = new Promise(function(resolve,reject) {
        Hero.deleteMany({},(err)=>{
            if(err){
                reject("Error");
                return res.send({error:err});
            }
            resolve("Success");
        });
    });
    let p2 = new Promise(function(resolve,reject) {
        Squad.deleteMany({},(err)=>{
            if(err){
                reject("Error");
                return res.send({error:err});
            }
            resolve("Success");
        });
    });
    Promise.all([p1,p2]).then(function() {
        let p3 = new Promise(function(resolve,reject) {
            Hero.insertMany(heroData,(err)=>{
                if(err){
                    reject("Error");
                    return res.send({error:err});
                }
                resolve("Success");
            });
        });
        let p4 = new Promise(function(resolve,reject) {
            Squad.insertMany(squadData,(err)=>{
                if(err){
                    reject("Error");
                    return res.send({error:err});
                }
                resolve("Success");
            });
        });
        Promise.all([p3,p4]).then(function() {
            res.redirect('/heroes');
        })
    });
}

getSquadIndex = function(req,res) {
    Squad.find({},null,{lean:true},(err,squads)=>{
        if (err) {
            res.send({error:err});
        }
        Hero.find({squad:{$exists:true}},"name stats squad",{lean:true},(err,heroes)=>{
            if(err){
                return res.send({error:err});
            }
            // console.log(heroes);
            for (var i = 0; i < squads.length; i++) {
                squads[i].heroes = [];
                for (var j = 0; j < heroes.length; j++) {
                    if (heroes[j].squad === squads[i].name) {
                        heroes[j].overall = getOverall(heroes[j]);
                        squads[i].heroes.push(heroes[j]);
                        // squads[i].overall =
                        heroes.splice(j,1);
                        j--;
                    }
                }

                let overall = squads[i].heroes.reduce((acc,val) => acc+val.overall,0);
                squads[i].overall = overall;
            }
            res.render("squads",{title:"Super Squads",squads:squads});
        });
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
    Squad.findByIdAndRemove(params.squadid,(err,squad)=>{
        if (err) {
            res.send({error:err});
        }
        Hero.find({squad:{$exists:true}},"squad",{},(err,heroes)=>{
            if(err){
                return res.send({error:err});
            }
            let promises = [];
            for (var i = 0; i < heroes.length; i++) {
                if (heroes[i].squad == squad.name) {
                    heroes[i].squad = undefined;
                    let promise = new Promise(function(resolve,reject) {
                        heroes[i].save((err)=>{
                            if(err){
                                reject("error");
                                return res.send({error:err});
                            }
                            resolve("Success");
                        });
                    });
                    promises.push(promise);
                }
            }
            Promise.all(promises).then(function() {
                res.redirect("/squads");
            });
        });
    });
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
