let heroes = [
{
    name: "Rampage",
    description: "He's big... He's strong.  And he's really friendly.  He once tore down an enire skyscraper to save a child.",
    stats: getStats(100, 23, 88, 17, 42, 77, 32),
    origin: "Brooklyn",
    squad: "The Marvels"
}, {
    name: "Wolfenstein",
    description: "He summons wolves from another dimension that will follow him into battle. He also has a sword.",
    stats: getStats(65, 70, 83, 10, 42, 21, 80),
    origin: "Phili",
    squad: "The Marvels"
}, {
    name: "Cyberpunk",
    description: "He uses cybernetic implants to enhance his body. He has the capabilities of a sherman tank in each of his arms. He has x-ray vision that can see through walls.",
    stats: getStats(89, 95, 67, 3, 77, 58, 7),
    origin: "Unknown",
    squad: "The Marvels"
}, {
    name: "Winston",
    description: "A scientist gone rogue. He used to lead a top secret government program code named, 'REACH'.  He has since then disbanded; for reasons unknown...",
    stats: getStats(16, 32, 58, 66, 100, 40, 87),
    origin: "Unknown",
    squad: "The Marvels"
}, {
    name: "The Little",
    description: "A shapeshifter.  She specializes in silent assassinations and gathering information. She has completed more than 100 covert operations, all undetected.",
    stats: getStats(3, 99, 24, 90, 96, 76, 56),
    origin: "Isreal",
    squad: "The Marvels"
}, {
    name: "Dr. Everest",
    description: "A cheesy spellcaster capable of magnificent power. He is really cool and is really popular amongst the children.",
    stats: getStats(41, 69, 38, 88, 64, 55, 27),
    origin: "California",
    squad: "The Marvels"
}, {
    name: "Hotah",
    description: "A mysterious monk. He spends most of his time in silent meditation. Some believe that he can see into the future.",
    stats: getStats(40, 90, 75, 10, 88, 99, 99),
    origin: "India",
    squad: "The Marvels"
}, {
    name: "Tempest",
    description: "She can alter the weather, instantiate natural disasters, and speed up global warming.",
    stats: getStats(66, 42, 32, 79, 66, 67, 52),
    origin: "Unknown",
    squad: "The Marvels"
}, {
    name: "Brave Avery",
    description: "He leads an army of mercenaries, called 'The Atlas'. His army bolsters some of the most futuristic weapons, weapons not available to the public.",
    stats: getStats(100, 88, 64, 63, 59, 71, 30),
    origin: "Bangladesh",
    squad: "The Marvels"
}];

let squads = [{
    name: "The Marvels",
    hq: "New York"
}];


function getStats(s, p, e, c, i, a, l) {
    return {
        strength: s,
        perception: p,
        endurance: e,
        charisma: c,
        intelligence: i,
        agility: a,
        luck: l,
    }
}


module.exports = {
    heroes,
    squads
}
