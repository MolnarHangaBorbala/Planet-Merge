let userScore = 0;
let computerScore = 0;

const choices = ["|R|", "|P|", "|S|"];

const rockButton = document.getElementById("Rock");
const paperButton = document.getElementById("Paper");
const scissorsButton = document.getElementById("Scissors");
const playButton = document.getElementById("Playbtn");
const RightPlayer = document.getElementById("PlayerRight");
const LeftPlayer = document.getElementById("PlayerLeft");
const ScoreText = document.getElementById("ScoreBoardID");
const ResultText = document.getElementById("ResultText");
const logBook = document.getElementById("LogBook");

playButton.classList.add("no-link");
playButton.classList.remove("link");
playButton.classList.remove("Playbtn");

rockButton.addEventListener("click", () => {
    rockButton.style.backgroundColor = "rgba(84, 160, 97, 1)";
    paperButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    playButton.disabled = false;
    playButton.classList.add("Playbtn");
    playButton.classList.remove("no-link");
    playButton.classList.add("link");
    userChoice = "|R|";
});

paperButton.addEventListener("click", () => {
    rockButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    paperButton.style.backgroundColor = "rgba(84, 160, 97, 1)";
    scissorsButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    playButton.disabled = false;
    playButton.classList.add("Playbtn");
    playButton.classList.remove("no-link");
    playButton.classList.add("link");
    userChoice = "|P|";
});

scissorsButton.addEventListener("click", () => {
    rockButton.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton.style.backgroundColor = "rgba(84, 160, 97, 1)";
    playButton.disabled = false;
    playButton.classList.add("Playbtn");
    playButton.classList.remove("no-link");
    playButton.classList.add("link");
    userChoice = "|S|";
});

function addLogEntry(userChoice, computerChoice, resultText) {
    const entry = document.createElement("li");

    entry.textContent = `You: ${userChoice}, Comp.: ${computerChoice} → ${resultText}`;

    if (resultText === "You won!") {
        entry.classList.add("log-win");
    } else if (resultText === "You lost!") {
        entry.classList.add("log-lose");
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

    rockButton.disabled = true;
    paperButton.disabled = true;
    scissorsButton.disabled = true;

    playButton.classList.add("no-link");
    playButton.classList.remove("link");
    playButton.classList.remove("Playbtn");

    rockButton.classList.add("opa");
    paperButton.classList.add("opa");
    scissorsButton.classList.add("opa");

    const computerChoice = choices[Math.floor(Math.random() * choices.length)]

    setTimeout(() => {
        RightPlayer.classList.remove("animate");
        LeftPlayer.classList.remove("animate");

        ResultText.classList.remove("log-win", "log-lose", "log-draw");

        if (userChoice === computerChoice) {
            ResultText.textContent = "Draw!";
            ResultText.classList.add("log-draw");
        } else if (
            (userChoice === "|R|" && computerChoice === "|S|") ||
            (userChoice === "|P|" && computerChoice === "|R|") ||
            (userChoice === "|S|" && computerChoice === "|P|")
        ) {
            ResultText.textContent = "You won!";
            ResultText.classList.add("log-win");
            userScore++;
        } else {
            ResultText.textContent = "You lost!";
            ResultText.classList.add("log-lose");
            computerScore++;
        }

        if (userChoice === "|R|") {
            LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
        } else if (userChoice === "|P|") {
            LeftPlayer.src = "../img/paper/no-bg-2/paper-right-no-bg-2.png";
        } else if (userChoice === "|S|") {
            LeftPlayer.src = "../img/scissors/no-bg-2/scissors-right-no-bg-2.png";
        }

        if (computerChoice === "|R|") {
            RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png"
        } else if (computerChoice === "|P|") {
            RightPlayer.src = "../img/paper/no-bg-2/paper-left-no-bg-2.png"
        } else if (computerChoice === "|S|") {
            RightPlayer.src = "../img/scissors/no-bg-2/scissors-left-no-bg-2.png"
        }

        ScoreText.textContent = `${userScore} x ${computerScore}`;
        addLogEntry(userChoice, computerChoice, ResultText.textContent);

        rockButton.style.backgroundColor = "rgba(255, 255, 255, 1)";
        paperButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
        scissorsButton.style.backgroundColor = "rgba(252, 252, 252, 1)";

        rockButton.disabled = false;
        paperButton.disabled = false;
        scissorsButton.disabled = false;

        rockButton.classList.remove("opa");
        paperButton.classList.remove("opa");
        scissorsButton.classList.remove("opa");
    }, 2250);

    playButton.disabled = true;
});

ScoreText.textContent = `${userScore} x ${computerScore}`;

function clearLog() {
    logBook.innerHTML = "";
    userScore = 0;
    computerScore = 0;
    ScoreText.textContent = `${userScore} x ${computerScore}`;
    ResultText.textContent = "Play!";
    ResultText.classList.remove("log-win");
    ResultText.classList.remove("log-lose");
    ResultText.classList.remove("log-draw");
    RightPlayer.src = "../img/rock/no-bg-2/rock-left-no-bg-2.png";
    LeftPlayer.src = "../img/rock/no-bg-2/rock-right-no-bg-2.png";
    rockButton.style.backgroundColor = "rgba(255, 255, 255, 1)";
    paperButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    scissorsButton.style.backgroundColor = "rgba(252, 252, 252, 1)";
    playButton.disabled = true;
}