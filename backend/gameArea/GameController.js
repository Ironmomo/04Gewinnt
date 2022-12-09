const {Game} = require("./Game")
const model = new Map()
const maxNumberOfActiveGames = 50

function createNewGame(req,res) {
    if(model.size === maxNumberOfActiveGames) {
        res.redirect("/")
    } else {
        const gameMode = req.body.mode
        const gameKey = randomKey()
        const newGame = new Game(gameMode)
        model.set(gameKey,newGame)
        res.json({gameKey:gameKey, gameBoard:newGame.gameBoard})
    }
}

function findgame() {
    return (req,res,next) => {
        const game = model.get(req.params.gameKey)
        if (game) {
            req.body.game = game
            next()
        } else {
            res.redirect("/")
        }
    }
}

function makeMove(req,res) {
    const game = req.body.game
    if(Number.isInteger(req.body.cell)) {
        game.nextMove(req.body.cell, req.body.playerKey)
        res.json({gameBoard: game.gameBoard, hasWinner: game.winner})  
        if(game.winner) {
            removeGame(game)
        } 
    }
}

function removeGame(game) {
    model.delete(game)
}

//private
function randomKey() {
    let key = ""
    for(let i = 0; i < 32; i++) {
        let newChar = String.fromCharCode(Math.floor(Math.random() * (122-97)) + 97)
        key += newChar
    }
    return key
}

module.exports = {createNewGame, findgame, makeMove}