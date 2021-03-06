const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const Squad = mongoose.model('Squad');

const data = require('../../data');
const heroesData = data.heroes;
const squadData = data.squads;

function getOverall(hero) {
    let { strength:s, perception:p, endurance:e, charisma:c, intelligence:i, agility:a, luck:l } = hero.statistic;
    let arr = [s, p, e, c, i, a, l];
    return arr.reduce((a, b) => a + b, 0);
}

const getIndex = (req,res)=>{
    res.render('index', { title: 'Mongoose' });
}
const getHeroIndex = (req,res)=>{
    Hero.find({},null,{ lean:true },(err,heroes)=>{
        if (err){
            return res.send({ error :err });
        }
        for (const hero of heroes) {
            hero.overall = getOverall(hero);
        }
        res.render('heroes', { title : "Hall Of Heroes",heroes : heroes });
    })
}
const getHeroForm = (req,res)=>{
    Squad.find((err,squads)=>{
        if(err){
            return res.send({ error : err });
        }
        res.render('create-hero', { title : "Create A Hero" ,squads : squads});
    })
}

const createNewHero = (req,res)=>{
    let body = req.body;
    let hero = {
        name : body.name,
        description : body.desc,
        statistic: {
            strength: body.strength,
            perception: body.perception,
            endurance: body.endurance,
            charisma: body.charisma,
            intelligence: body.intelligence,
            agility: body.agility,
            luck: body.luck
        }
    }
    body.origin && (hero.origin = body.origin);
    body.squad && (hero.squad = body.squad);

    Hero.create(hero,(err,_)=>{
        if (err){
            return res.send({ error : err });
        }
        res.redirect('/heroes');
    })
}
const deleteHero = (req,res) => {
    Hero.findByIdAndRemove(req.params.id,(err,_)=>{
        if (err){
            return res.send({ error : err });
        }
        res.redirect("/heroes");
    });
}
const getUpdateForm = (req,res)=>{
    Hero.findById(req.params.id,(err,hero)=>{
        if (err){
            return res.send({ error : err });
        }
        Squad.find((err,squads)=>{
            if(err){
                return res.send({ error : err });
            }
            res.render("update-hero", { title : "Update Hero", hero : hero ,squads:squads});
        })
    })
}
const updateHero = (req,res)=>{
    Hero.findById(req.params.id,(err,hero)=>{
        if (err){
            return res.send({ error : err });
        }
        hero.name = req.body.name;
        hero.description = req.body.desc;
        hero.origin = req.body.origin;
        hero.statistic.strength = req.body.strength;
        hero.statistic.perception = req.body.perception;
        hero.statistic.endurance = req.body.endurance;
        hero.statistic.charisma = req.body.charisma;
        hero.statistic.intelligence = req.body.intelligence;
        hero.statistic.agility = req.body.agility;
        hero.statistic.luck = req.body.luck;
        hero.squad = undefined;

        req.body.squad && (hero.squad = req.body.squad);

        hero.save((err,_)=>{
            if (err){
                return res.send({ error : err });
            }
            res.redirect("/heroes");
        })
    })
}

const reset = (req,res)=>{
    let p1 = new Promise((resolve,reject)=>{
        Hero.deleteMany({},(err,_)=>{
            if (err){
                reject("Error");
                return res.send({ error:err });
            }
            resolve("Success");
        });
    });
    let p2 = new Promise((resolve, reject)=>{
        Squad.deleteMany({},(err,_)=>{
            if(err){
                reject("Error");
                return res.send({ error : err });
            }
            resolve("Success");
        });
    });
    Promise.all([p1,p2]).then(()=> {
        let p3 = new Promise((resolve, reject)=>{
            Hero.insertMany(heroesData).then(_ => {
                resolve("Success");
            }).catch(() => {
                if (err) {
                    reject("Error");
                    return res.send({error: err});
                }
            });
        });
        let p4 = new Promise((resolve, reject)=>{
            Squad.insertMany(squadData).then(_ => {
                resolve("Success");
            }).catch(() => {
                if (err) {
                    reject("Error");
                    return res.send({error: err});
                }
            });
        });
        Promise.all([p3,p4]).then(()=>{
            res.redirect("/heroes");
        })
    });
}
const getSquadsIndex = (req,res)=>{
    Squad.find({},null,{lean : true},(err,squads)=>{
        if(err){
            return res.send({ error : err });
        }
        Hero.find({squad : { $exists : true } },null,{lean:true},(err,heroes)=>{
            if(err) {
                return res.send({error: err});
            }
            for (const squad of squads) {
                squad.heroes = [];
                squad.overall = 0;
                for (let j = 0;j<heroes.length;j++) {
                    if (heroes[j].squad === squad.name){
                        heroes[j].overall = getOverall(heroes[j]);

                        squad.heroes.push(heroes[j]);
                        squad.overall += heroes[j].overall;

                        heroes.splice(j,1);
                        j--;
                    }
                }
            }
            res.render("squads",{ title:"Super Squads" ,squads : squads});
        })
    });
}
const getSquadsForm = (req,res)=>{
    res.render("create-squad",{ title:"Super Squads" });
}
const createSquad = (req,res)=>{
    let squad = { name : req.body.name };
    squad.hq = req.body.hq? req.body.hq : "Unknown";

    Squad.create(squad,(err,_)=>{
        if (err){
            return res.send({error : err});
        }
        res.redirect("/squads");
    });
}
const deleteSquad = (req,res)=>{
    Squad.findByIdAndRemove(req.params.id,(err,squad)=>{
        if(err){
            return res.send({ error : err });
        }
        Hero.find({squad : {$exists : true} },"squad",{},(err,heroes)=>{
            if(err){
                return res.send({ error : err });
            }
            let promises = [];
            for (const hero of heroes) {
                if (hero.squad === squad.name){
                    hero.squad = undefined;
                    let promise = new Promise((resolve, reject)=>{
                        hero.save().then(_ =>{
                            resolve("Success");
                        }).catch((err)=>{
                            reject("Error")
                            return res.send({ error:err });
                        })
                    });
                    promises.push(promise);
                }
            }
            Promise.all(promises).then(()=>{
                res.redirect("/squads");
            })
        });
    })
}
module.exports = {
    getIndex,
    getHeroIndex,
    getHeroForm,
    createNewHero,
    deleteHero,
    getUpdateForm,
    updateHero,
    reset,
    getSquadsIndex,
    getSquadsForm,
    createSquad,
    deleteSquad
}