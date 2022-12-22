const board = document.querySelector(".board")
const btnOne = document.getElementById("btnOne")
const btnTwo = document.getElementById("btnTwo")
const msgBox = document.getElementById("messageBox")
const btnNext = document.getElementById("btnNext")
import {Coin} from "./Coin.js"
import { Game } from "./LocalGame.js"
import { renderSJDON, createSJDONElement } from "./render-sjdon.js"

let Configs = {
    fieldWidth: 0,
    numRows: 6,
    numCells: 7,
    hasWinner: undefined,
    gameMode: 1,
    gameKey: undefined,
    savedLocal: false
}

//Variables
let gameBoard = Array(Configs.numRows).fill("").map(() => Array(Configs.numCells).fill(""))
let allCoins = []
let localGame = undefined

//send&recieve
function sendMove(y) {
    const data = {cell: y, gameKey:Configs.gameKey}
    let baseUrl = "/gameArea/move/"
    baseUrl = baseUrl.concat(`${Configs.gameKey}`)
    fetch(baseUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        gameBoard = response.gameBoard
        Configs.hasWinner = response.hasWinner
        updateGame()
    })
    .catch(e => {
        console.error(e)
        localGame = new Game(Configs.gameMode)
        localGame.gameBoard = gameBoard
        Configs.savedLocal = true
        saveLocal()
    })  
}

function startNewGame(mode) {
    Configs.hasWinner = undefined
    msgBox.className = ""
    const data = {mode: mode}
    fetch("/gameArea/newGame", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        gameBoard = response.gameBoard
        Configs.gameKey = response.gameKey
        parseBoard()
        showBoard()
    })
    .catch(e => {
        console.error(e)
        localGame = new Game(mode)
        Configs.savedLocal = true
        saveLocal()
        updateGame()
    })
}

//Functions

function parseBoard() {
    gameBoard.forEach((row,y) => {
        row.forEach((cell, x) => {
            let coin = ""
            if(cell === "r") {
                coin = new Coin("red",false)
            } else if(cell === "b") {
                coin = new Coin("blue",false)
            }
            else if(cell === "rn") {
                coin = new Coin("red",true)
            } else if(cell === "bn") {
                coin = new Coin("blue",true)
            }
            if(coin instanceof Coin) {
                allCoins.push(coin)
            }
            gameBoard[y][x] = coin
        })
    })
}

function parseBoardToString() {
    gameBoard.forEach((row,y) => {
        row.forEach((cell, x) => {
            if(gameBoard[y][x] instanceof Coin) {
                gameBoard[y][x] = gameBoard[y][x].color

            }
        })
    })
}

function showBoard () {
    const elements = []
    gameBoard.forEach((row,yIdx) => {
        row.forEach((field,xIdx) => {
            if(field === "") {
                const div = createSJDONElement("div", {class:"field"})
                elements.push(div)
            }else if(field instanceof Coin) {
                let idx = yIdx*Configs.numCells + xIdx
                const fDiv = board.childNodes[idx]
                field.setPositionRelativToParent(fDiv)
                const cDiv = createSJDONElement("div",{class:`piece ${field.color}`, style: `top: ${field.currentPosition.y}px; left: ${field.currentPosition.x}px`})
                const newFDiv = createSJDONElement("div", {class:"field"}, undefined, cDiv)
                elements.push(newFDiv)
            }
        })
    })
    renderSJDON(elements, board)
}

function animation(cell) {
    cell.updateCurrentPosition()
    cell.currentPosition.y === cell.position.y ? undefined : requestAnimationFrame(() => animation(cell))
    showBoard()
}

function updateGame(){
    parseBoard()
    showBoard()
    allCoins.forEach(coin =>  {
        if(coin.isNew) {
            if(coin.color === "red" && Configs.gameMode === 1) {
                setTimeout(() => animation(coin),200)
            } else {
                animation(coin)
            }
        }
    })
    if(Configs.hasWinner) {
        resetGame()
        showWinner()
    }
}

function sendLocalMove(cell) {
    parseBoardToString()
    localGame.nextMove(new String(cell))
    gameBoard = localGame.gameBoard
    Configs.hasWinner = localGame.winner
    saveLocal()
}

function saveLocal() {
    const data = {gameBoard: gameBoard, activePlayer: localGame.activePlayer, configs: Configs}
    localStorage.setItem("localGame",JSON.stringify(data))
}

function resetGame() {
    localGame = undefined
    Configs.savedLocal = false
    localStorage.clear()
}

//eventlisteners
btnOne.addEventListener("click",() => {
    resetGame()
    Configs.gameMode = 1
    startNewGame(1)
})

btnTwo.addEventListener("click",() => {
    resetGame()
    Configs.gameMode = 2
    startNewGame(2)
})

btnNext.addEventListener("click",() => {
    resetGame()
    startNewGame(Configs.gameMode)
})

board.addEventListener("click",(event) => {
    const cell = Math.floor((event.clientX - board.offsetLeft)/Configs.fieldWidth)
    if(localGame) {
        sendLocalMove(cell)
        updateGame()
    } else {
        sendMove(cell)
    }
})

function showWinner() {
    msgBox.childNodes[1].innerHTML = `${Configs.hasWinner} WON!!`
    msgBox.className = "show"
}

onload = () => {
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
    let data = localStorage.getItem("localGame")
    if(data) {
        data = JSON.parse(data)
        localGame = new Game(data.configs.gameMode)
        gameBoard = data.gameBoard
        localGame.gameBoard = gameBoard
        localGame.activePlayer = data.activePlayer
        Configs = data.configs
        updateGame()
    }
}

onresize = () => {
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
}
