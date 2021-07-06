const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');

const getIndex = (req,res)=>{
    res.render('index', { title: 'Mongoose' });
}
const getHeroIndex = (req,res)=>{
    res.render('heroes', { title : "Hall Of Heroes" });
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
    body.origin && (hero.origin === body.origin);

    Hero.create(hero,(err,newHero)=>{
        if (err){
            return res.send({ error : err });
        }
        res.send(newHero);
    })
}
module.exports = {
    getIndex,
    getHeroIndex,
    getHeroForm,
    createNewHero
}