const express = require("express")
const router = express.Router()
const {createNewGame, findgame, makeMove} = require("./GameController")


router.post("/move/:gameKey",findgame(),makeMove)

router.post("/newGame",createNewGame)

module.exports = router