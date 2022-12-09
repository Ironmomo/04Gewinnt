function checkString() {
    const reg = new RegExp('[a-z]')
    return (req,res,next) => {
        if(reg.test(req.params.gameKey)) {
            next()
        } else {
            res.redirect("/")
        }
    }
}

module.exports = {checkString}