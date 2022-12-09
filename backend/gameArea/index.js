const express = require("express")
const router = express.Router()
const {createNewGame, findgame, makeMove} = require("./GameController")
const {checkString} = require("../security")


router.post("/move/:gameKey", checkString(),findgame(),makeMove)

router.post("/newGame",createNewGame)

module.exports = router