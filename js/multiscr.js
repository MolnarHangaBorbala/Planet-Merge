let player1 = 0;
let player2 = 0;

const choices = ["|R|", "|P|", "|S|"];

const rockButton1 = document.getElementById("Rock1");
const paperButton1 = document.getElementById("Paper1");
const scissorsButton1 = document.getElementById("Scissors1");
const rockButton2 = document.getElementById("Rock2");
const paperButton2 = document.getElementById("Paper2");
const scissorsButton2 = document.getElementById("Scissors2");
const playButton = document.getElementById("Playbtn");
const RightPlayer = document.getElementById("PlayerRight");
const LeftPlayer = document.getElementById("PlayerLeft");
const ScoreText = document.getElementById("ScoreBoardID");
const ResultText = document.getElementById("ResultText");
const logBook = document.getElementById("LogBook");
const LCheckButton = document.getElementById("LeftCheckBtn");
const RCheckButton = document.getElementById("RightCheckBtn");
const LleftCont = document.querySelector(".LowerLeftContainer");
const LrightCont = document.querySelector(".LowerRightContainer");

LCheckButton.classList.add("no-link");
LCheckButton.classList.remove("link");
LCheckButton.classList.remove("CheckBtnHov");
LCheckButton.style.opacity = "0.5";

RCheckButton.classList.add("no-link");
RCheckButton.classList.remove("link");
RCheckButton.classList.remove("CheckBtnHov");
RCheckButton.style.opacity = "0.5";

playButton.classList.add("no-link");
playButton.classList.remove("link");
playButton.classList.remove("Playbtn");

rockButton1.addEventListener("click", () => {
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
    rockButton1.style.backgroundColor = "rgba(84, 160, 97, 1)";
    paperButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    LCheckButton.disabled = false;
    LCheckButton.classList.add("link");
    LCheckButton.classList.remove("no-link");
    LCheckButton.classList.add("CheckBtnHov");
    LCheckButton.style.opacity = "1";
    player1Choice = "|R|";
});

paperButton1.addEventListener("click", () => {
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
    rockButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    paperButton1.style.backgroundColor = "rgba(84, 160, 97, 1)";
    scissorsButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    LCheckButton.disabled = false;
    LCheckButton.classList.add("link");
    LCheckButton.classList.remove("no-link");
    LCheckButton.classList.add("CheckBtnHov");
    LCheckButton.style.opacity = "1";
    player1Choice = "|P|";
});

scissorsButton1.addEventListener("click", () => {
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
    rockButton1.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton1.style.backgroundColor = "rgba(84, 160, 97, 1)";
    LCheckButton.disabled = false;
    LCheckButton.classList.add("link");
    LCheckButton.classList.remove("no-link");
    LCheckButton.classList.add("CheckBtnHov");
    LCheckButton.style.opacity = "1";
    player1Choice = "|S|";
});

LCheckButton.addEventListener("click", () => {
    LleftCont.style.display = "none";
    LrightCont.style.display = "block";
    LCheckButton.classList.add("no-link");
    LCheckButton.classList.remove("link");
    LCheckButton.classList.remove("CheckBtnHov");
    LCheckButton.style.opacity = "0.5";
});
/* --------------------------------------------------------------------------------- */
rockButton2.addEventListener("click", () => {
    rockButton2.style.backgroundColor = "rgba(84, 160, 97, 1)";
    paperButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    RCheckButton.disabled = false;
    RCheckButton.classList.add("link");
    RCheckButton.classList.remove("no-link");
    RCheckButton.classList.add("CheckBtnHov");
    RCheckButton.style.opacity = "1";
    player2Choice = "|R|";
});

paperButton2.addEventListener("click", () => {
    rockButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    paperButton2.style.backgroundColor = "rgba(84, 160, 97, 1)";
    scissorsButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    RCheckButton.disabled = false;
    RCheckButton.classList.add("link");
    RCheckButton.classList.remove("no-link");
    RCheckButton.classList.add("CheckBtnHov");
    RCheckButton.style.opacity = "1";
    player2Choice = "|P|";
});

scissorsButton2.addEventListener("click", () => {
    rockButton2.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton2.style.backgroundColor = "rgba(84, 160, 97, 1)";
    RCheckButton.disabled = false;
    RCheckButton.classList.add("link");
    RCheckButton.classList.remove("no-link");
    RCheckButton.classList.add("CheckBtnHov");
    RCheckButton.style.opacity = "1";
    player2Choice = "|S|";
});

RCheckButton.addEventListener("click", () => {
    playButton.disabled = false;
    LrightCont.style.display = "none";
    RCheckButton.classList.add("no-link");
    RCheckButton.classList.remove("link");
    RCheckButton.classList.remove("CheckBtnHov");
    RCheckButton.style.opacity = "0.5";
    playButton.classList.add("Playbtn");
    playButton.classList.remove("no-link");
    playButton.classList.add("link");
});

/* --------------------------------------------------------------------------------- */
function addLogEntry(player1Choice, player2Choice, resultText) {
    const entry = document.createElement("li");

    entry.textContent = `P1: ${player1Choice}, P2.: ${player2Choice} → ${resultText}`;

    if (resultText === "P1 won!") {
        entry.classList.add("log-P1-win");
    } else if (resultText === "P2 won!") {
        entry.classList.add("log-P2-win");
    } else {
        entry.classList.add("log-draw");
    }

    logBook.prepend(entry);
}

playButton.addEventListener("click", () => {
    RightPlayer.classList.add("animate");
    LeftPlayer.classList.add("animate");
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";

    playButton.classList.remove("link");
    playButton.classList.add("no-link");
    playButton.classList.remove("Playbtn");

    setTimeout(() => {
        RightPlayer.classList.remove("animate");
        LeftPlayer.classList.remove("animate");

        ResultText.classList.remove("log-P1-win", "log-P2-win", "log-draw");

        if (player1Choice === player2Choice) {
            ResultText.textContent = "Draw!";
            ResultText.classList.add("log-draw");
        } else if (
            (player1Choice === "|R|" && player2Choice === "|S|") ||
            (player1Choice === "|P|" && player2Choice === "|R|") ||
            (player1Choice === "|S|" && player2Choice === "|P|")
        ) {
            ResultText.textContent = "P1 won!";
            ResultText.classList.add("log-P1-win");
            player1++;
        } else {
            ResultText.textContent = "P2 won!";
            ResultText.classList.add("log-P2-win");
            player2++;
        }

        if (player1Choice === "|R|") {
            LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
        } else if (player1Choice === "|P|") {
            LeftPlayer.src = "../img/paper/no-bg-2/paper-right-no-bg-2.png";
        } else if (player1Choice === "|S|") {
            LeftPlayer.src = "../img/scissors/no-bg-2/scissors-right-no-bg-2.png";
        }

        if (player2Choice === "|R|") {
            RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
        } else if (player2Choice === "|P|") {
            RightPlayer.src = "../img/paper/no-bg-2/paper-left-no-bg-2.png";
        } else if (player2Choice === "|S|") {
            RightPlayer.src = "../img/scissors/no-bg-2/scissors-left-no-bg-2.png";
        }

        ScoreText.textContent = `${player1} x ${player2}`;
        addLogEntry(player1Choice, player2Choice, ResultText.textContent);

        LleftCont.style.display = "block";
        rockButton1.style.backgroundColor = "rgba(255, 255, 255, 1)";
        paperButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
        scissorsButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";

        rockButton2.style.backgroundColor = "rgba(255, 255, 255, 1)";
        paperButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
        scissorsButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    }, 2250);
    playButton.disabled = true;
    LCheckButton.disabled = true;
    RCheckButton.disabled = true;
});

ScoreText.textContent = `${player1} x ${player2}`;

function clearLog() {
    logBook.innerHTML = "";
    player1 = 0;
    player2 = 0;
    ScoreText.textContent = `${player1} x ${player2}`;
    ResultText.textContent = "Play!";
    ResultText.classList.remove("log-P1-win");
    ResultText.classList.remove("log-P2-win");
    ResultText.classList.remove("log-draw");
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
    rockButton1.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton1.style.backgroundColor = "rgba(252, 252, 252, 1)";
    rockButton2.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton2.style.backgroundColor = "rgba(252, 252, 252, 1)";
    playButton.disabled = true;
    LCheckButton.disabled = true;
    RCheckButton.disabled = true;
}

function home() {
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 250); 
};