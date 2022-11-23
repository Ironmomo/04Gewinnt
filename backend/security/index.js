function checkData(toCheck) {
    return (req,res,next) => {
        if(req.body[`${toCheck}`]) {
            next()
        }
        res.redirect("/")
    }
}

module.exports = {hasGameKey, checkData}