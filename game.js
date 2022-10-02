let onePlayer = false;
let twoPlayer = false;
let aiMoving = false;
let playerSymbol = "X";
let oPos = [];
let xPos = [];
let gameEnd = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init() {
    document.querySelector("#board").addEventListener('click', playerMove, false);
    document.querySelectorAll("#buttons button").forEach(button => 
        button.addEventListener('click', start, false));
    document.querySelector("#restart").addEventListener('click', restartGame, false);
}

window.addEventListener('load', init, false);

function playerMove(e) {
    if (!(e.target.tagName == "TD")) return;
    if (!(e.target.innerHTML == "")) return;
    if (!(onePlayer || twoPlayer)) return;
    if (aiMoving) return;
    if (gameEnd) return;

    const text = document.querySelector("#dialogue");

    if (twoPlayer) {
        e.target.innerHTML = playerSymbol;
        if (playerSymbol == "X") {
            playerSymbol = "O";
            text.innerHTML = "Lép: 2. Játékos";
        } else {
            playerSymbol = "X";
            text.innerHTML = "Lép: 1. Játékos";
        }
        checkBoard();
    }

    if (onePlayer) {
        e.target.innerHTML = playerSymbol;
        checkBoard();
        playerSymbol == "X" ? aiMove("O") : aiMove("X");
    }
}

function start(e) {
    document.querySelector("#buttons").style.display = "none";
    const fields = document.querySelectorAll("#board td");
    for (let field of fields) {
        field.innerHTML = "";
    }

    const text = document.querySelector("#dialogue");

    if (e.target.id == "1player") {
        onePlayer = true;
        let rng = Math.floor(Math.random()*2);
        if (rng == 0) {
            aiMove("X");
            playerSymbol = "O";
        } else {
            text.innerHTML = "Lép: Játékos";
        }
    } else {
        twoPlayer = true;
        text.innerHTML = "Lép: 1. Játékos";
    }
}

async function aiMove(symbol) {
    if (gameEnd) return;
    const fields = document.querySelectorAll("#board td");
    const text = document.querySelector("#dialogue");
    let i;

    text.innerHTML = "A gép következik..."
    aiMoving = true;
    await new Promise(r => setTimeout(r, 1000));
    aiMoving = false;

    while (true) {
        i = Math.floor(Math.random()*9);
        if (fields[i].innerHTML.length == 0) {
            fields[i].innerHTML = symbol;
            break;
        }
    }

    text.innerHTML = "Lép: Játékos";
    checkBoard();
}

function checkBoard() {
    const fields = document.querySelectorAll("#board td");
    let xTmp = [];
    let oTmp = [];
    for (let i = 0; i<9; i++) {
        if (fields[i].innerHTML == "X") {
            xTmp.push(i);
        } else if (fields[i].innerHTML == "O") {
            oTmp.push(i);
        }
    }
    xPos = xTmp;
    oPos = oTmp;

    if (oPos.length < 3 && xPos.length < 3) return;

    for (let i = 0; i<winConditions.length; i++) {
        if (winConditions[i].every(x => xPos.includes(x))) {
            endGame("win", "X", winConditions[i]);
        }
    }

    for (let i = 0; i<winConditions.length; i++) {
        if (winConditions[i].every(x => oPos.includes(x))) {
            endGame("win", "O", winConditions[i]);
        }
    }

    if (oPos.length + xPos.length == 9 && !gameEnd) endGame("draw");

}

function endGame(result, winner, winningFields) {
    const fields = document.querySelectorAll("#board td");
    const text = document.querySelector("#dialogue");
    gameEnd = true;

    if (result == "draw") {
        text.innerHTML = "Döntetlen!";
    } else if (winner != playerSymbol && onePlayer) {
        text.innerHTML = "A gép nyert!";
    } else if (winner == playerSymbol && onePlayer) {
        text.innerHTML = "A játékos nyert!";
    } else {
        if (winner == "O") text.innerHTML = "A második játékos nyert!";
        else text.innerHTML = "Az első játékos nyert!";
    }

    if (result != "draw") {
        fields[winningFields[0]].style.backgroundColor = "#4fc83a";
        fields[winningFields[1]].style.backgroundColor = "#4fc83a";
        fields[winningFields[2]].style.backgroundColor = "#4fc83a";
    }

    document.querySelector("#end").style.display = "block";

}

function restartGame() {
    document.querySelector("#buttons").style.display = "block";
    document.querySelector("#end").style.display = "none";
    document.querySelector("#dialogue").innerHTML = "";
    const fields = document.querySelectorAll("#board td");
    for (let field of fields) {
        field.innerHTML = "";
        field.style.backgroundColor = "#3AAFB9";
    }
    xPos = [];
    oPos = [];
    onePlayer = false;
    twoPlayer = false;
    gameEnd = false;
}

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]