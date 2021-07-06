const getIndex = (req,res)=>{
    res.render('index', { title: 'Mongoose' });
}

module.exports = {
    getIndex
}