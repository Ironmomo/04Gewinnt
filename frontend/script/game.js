const board = document.querySelector(".board")
const btnOne = document.getElementById("btnOne")
const btnTwo = document.getElementById("btnTwo")
const msgBox = document.getElementById("messageBox")
const btnNext = document.getElementById("btnNext")

const Configs = {
    fieldWidth: 0,
    numRows: 6,
    numCells: 7,
    gameMode: 2,
    activePlayer: 0,
    isRunning: false,
    isAnimating: false
}

class Coin {
    constructor(color) {
        this.color = color
        this.position = {x:0,y:0}
        this.currentPosition = {x:0, y:0}
        this.velocityY = 1
    }

    setPositionRelativToParent(parentDiv) {
        this.position.x = parentDiv.offsetLeft + parentDiv.offsetWidth/2
        this.position.y = parentDiv.offsetTop + parentDiv.offsetHeight/2
        this.currentPosition.x = this.position.x
        
    }

    updateCurrentPosition() {
        if(this.currentPosition.y + this.velocityY <= this.position.y) {
            this.currentPosition.y = this.currentPosition.y + this.velocityY
            this.velocityY = this.velocityY + 0.5
        } else {
            this.currentPosition.y = this.position.y
        }
    }
}

//Variables
let gameBoard = Array(Configs.numRows).fill("").map(() => Array(Configs.numCells).fill(""))

//Functions

function showBoard () {
    const elements = []
    gameBoard.forEach((row,yIdx) => {
        row.forEach((field,xIdx) => {
            if(field === "") {
                const div = elt("div","field")
                elements.push(div)
            }else {
                let idx = yIdx*Configs.numCells + xIdx
                const fDiv = board.childNodes[idx]
                field.setPositionRelativToParent(fDiv)
                const cDiv = elt("div",`piece ${field.color}`)
                cDiv.style = `top: ${field.currentPosition.y}px; left: ${field.currentPosition.x}px`
                fDiv.replaceChildren(cDiv)
                elements.push(fDiv)
            }
        })
    })
    board.replaceChildren(...elements)
}

const elt = (type, className,...children) => {
    const el = document.createElement(type)
    el.className = className
    for(let child of children) {
        el.appendChild(child)
    }

    return el
}

function animation(cell) {
    cell.updateCurrentPosition()
    cell.currentPosition.y === cell.position.y ? Configs.isAnimating = false : requestAnimationFrame(() => animation(cell))
    showBoard()
}

function checkWinner() {
    for(let y = 0; y < Configs.numRows; y++) {
        for(let x = 0; x < Configs.numCells; x++) {
            if(gameBoard[y][x] instanceof Coin) {
                const color = gameBoard[y][x].color
                const hor =  checkHorizontal(x, y, color)
                const ver = checkVertical(x, y, color)
                const diaOne = checkDiagonal(x, y, color, true)
                const diaTwo = checkDiagonal(x, y, color, false)
                if(hor === 4 || ver === 4 || diaOne === 4 || diaTwo === 4) {
                    return true
                }
            }
        }
    }
}

function checkHorizontal(x,y,color) {
    if(0 <= x && x < Configs.numCells && gameBoard[y][x] instanceof Coin && gameBoard[y][x].color === color) {
        return 1 + checkHorizontal(x + 1, y, color)
    }
    return 0
}

function checkVertical(x,y,color) {
    if(0 <= y && y < Configs.numRows && gameBoard[y][x] instanceof Coin && gameBoard[y][x].color === color) {
        return 1 + checkVertical(x, y + 1, color)
    }
    return 0
}

function checkDiagonal(x,y,color,min) {
    if(0 <= x && x < Configs.numCells && 0 <= y && y < Configs.numRows && gameBoard[y][x] instanceof Coin && gameBoard[y][x].color === color) {
        if(min) {
            return 1 + checkDiagonal(x - 1, y + 1, color, true)
        } else {
            return 1 + checkDiagonal(x + 1, y + 1, color, false)
        }
    }
    return 0
}

function makeMove(cell, color) {
    if(Configs.isRunning) {
        let row = -1
        for(let i = Configs.numRows - 1; i >= 0; i--) {
            if(gameBoard[i][cell] === "") {
                row = i
                break
            }
        }
        if(row !== -1) {
            const newCoin = new Coin(color)
            gameBoard[row][cell] = newCoin
            return newCoin
        }
    }
}

function resetMove(cell) {
    for(let i = 0; i < Configs.numRows; i++) {
        if(gameBoard[i][cell] instanceof Coin) {
            gameBoard[i][cell] = ""
            break
        }
    }
}

//eventlisteners
btnOne.addEventListener("click",() => {
    resetGame()
    Configs.gameMode = 1
})

btnTwo.addEventListener("click",() => {
    resetGame()
    Configs.gameMode = 2
})

btnNext.addEventListener("click",() => {
    resetGame()
})

board.addEventListener("click",(event) => {
    const cell = Math.floor((event.clientX - board.offsetLeft)/Configs.fieldWidth)
    humanMakeMove(cell)
    if(Configs.activePlayer === 1 && Configs.gameMode === 1) {
        aiMakeMove()
    }
})

function resetGame() {
    gameBoard = Array(Configs.numRows).fill("").map(() => Array(Configs.numCells).fill(""))
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
    msgBox.className = ""
    Configs.activePlayer = 0
    Configs.isRunning = true
}

function humanMakeMove(cell) {
    const color = Configs.activePlayer === 0 ? "blue" : "red"
    const newCoin = makeMove(cell,color)
    Configs.activePlayer = (Configs.activePlayer + 1) % 2
    showBoard()
    animation(newCoin)
    if(checkWinner()) {
        showWinner(color)
    }
}

function aiMakeMove() {
    const bestMove = findBestMove()
    const newCoin = makeMove(bestMove, "red")
    showBoard()
    setTimeout(() => {
        animation(newCoin)
    },200)
    Configs.activePlayer = (Configs.activePlayer + 1) % 2
    if(checkWinner()) {
        showWinner("red")
    }
}

function showWinner(color) {
    Configs.isRunning = false
    console.log(msgBox)
    msgBox.childNodes[1].innerHTML = `${color} WON!!`
    msgBox.className = "show"
}

onload = () => {
    resetGame()
    Configs.gameMode = 2
}

onresize = () => {
    const allCoins = []
    gameBoard.forEach(row => row.forEach(cell => {
        if(cell instanceof Coin) {
            cell.currentPosition.y = 0
            cell.velocityY = 1
            allCoins.push(cell)
        }
    }))
    showBoard()
    Configs.fieldWidth = board.childNodes[0].offsetWidth
    allCoins.forEach(coin => animation(coin))
}

//minimax

function findBestMove() {
    let currentBestMove = undefined
    let maxWert = -Infinity
    for(let i = 0; i < Configs.numCells; i++) {
        if(gameBoard[0][i] === "") {
            makeMove(i,"red")
            let score = minimax(6,-Infinity,Infinity,false)
            resetMove(i)
            if(score >= maxWert) {
                maxWert = score
                currentBestMove = i
            }
        }
    }
    return currentBestMove
}

const bewertungsMatrix = [[0.03,0.04,0.05,0.07,0.05,0.04,0.03],
                        [0.04,0.06,0.07,0.1,0.07,0.06,0.04],
                        [0.05,0.08,0.11,0.13,0.11,0.08,0.05],
                        [0.05,0.08,0.11,0.13,0.11,0.08,0.05],
                        [0.04,0.06,0.07,0.1,0.07,0.06,0.04],
                        [0.03,0.04,0.05,0.07,0.05,0.04,0.03]]

function bewertung() {
    let bew = 0
    gameBoard.forEach((row,y) => {
        row.forEach((col,x) => {
            if(col instanceof Coin) {
                col.color === "red" ? bew += bewertungsMatrix[y][x] : bew -= bewertungsMatrix[y][x]
            }
        })
    })
    return bew
}

function minimax(depth,alpha,beta,isMax) {
    if(checkWinner()) {
        if(isMax) {
            return -Infinity
        } else {
            return Infinity
        }
    }
    if(depth === 0 ) {
        return bewertung()
    }
    if(isMax) {
        for(let i = 0; i < Configs.numCells; i++) {
            if(gameBoard[0][i] === "") {
                makeMove(i,"red")
                alpha = Math.max(alpha, minimax(depth - 1, alpha, beta, false))
                resetMove(i)
                if(alpha >= beta) {
                    return alpha
                }
            }
        }
        return alpha
    }

    if(!isMax) {
        for(let i = 0; i < Configs.numCells; i++) {
            if(gameBoard[0][i] === "") {
                makeMove(i,"blue")
                beta = Math.min(beta,minimax(depth - 1, alpha, beta, true))
                resetMove(i)
                if(alpha >= beta) {
                    return beta
                }
            }
        }
        return beta
    }
}



/**
 * Artefacts
 * 
 * const randomSetField = () => {
    let color = "red"
    if(Math.round(Math.random()) === 1) {
        color = "blue"
    }
    const field = Math.round(Math.random() * 41)
    let row = field % Configs.numRows
    let cell = field % Configs.numCells
    gameBoard[row][cell] = new Coin(color)
    showBoard()
}
 */
