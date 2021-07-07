const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const Squad = mongoose.model('Squad');

const data = require('../../data');
const heroesData = data.heroes;

const getIndex = (req,res)=>{
    res.render('index', { title: 'Mongoose' });
}
const getHeroIndex = (req,res)=>{
    Hero.find((err,heroes)=>{
        if (err){
            return res.send({ error :err });
        }
        res.render('heroes', { title : "Hall Of Heroes",heroes : heroes });
    })
}
const getHeroForm = (req,res)=>{
    res.render('create-hero', { title : "Create A Hero" });
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
        res.render("update-hero", { title : "Update Hero", hero : hero });
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

        hero.save((err,_)=>{
            if (err){
                return res.send({ error : err });
            }
            res.redirect("/heroes");
        })
    })
}

const reset = (req,res)=>{
    Hero.deleteMany({},(err,_)=>{
        if (err){
            return res.send({ error:err });
        }
        Hero.insertMany(heroesData).then(_ => {
            res.redirect("/heroes");
        }).catch(()=>{
            if (err){
                return res.send({ error:err });
            }
        })
    });
}
const getSquadsIndex = (req,res)=>{
    Squad.find((err,squads)=>{
        if(err){
            return res.send({ error : err });
        }
        res.render("squads",{ title:"Super Squads" ,squads : squads});
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
    createSquad
}