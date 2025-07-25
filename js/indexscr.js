const MultiBtn = document.getElementById("MultiBtn");
const CompBtn = document.getElementById("CompBtn");
const playButton = document.getElementById("Playbtn");
const LoadingText = document.getElementById("loading");
const overlay = document.getElementById('fadeOverlay');
LoadingText.style.opacity = "0";

MultiBtn.disabled = false;
CompBtn.disabled = false;

playButton.classList.add("no-link");
playButton.classList.remove("link");
playButton.classList.remove("Playbtn");

let btn = 0;

MultiBtn.addEventListener("click", () => {
    playButton.disabled = false;
    MultiBtn.classList.add("active");
    CompBtn.classList.remove("active");
    playButton.classList.add("link");
    playButton.classList.remove("no-link");
    playButton.classList.add("Playbtn");
    btn = 1;
});

CompBtn.addEventListener("click", () => {
    playButton.disabled = false;
    CompBtn.classList.add("active");
    MultiBtn.classList.remove("active");
    playButton.classList.add("link");
    playButton.classList.remove("no-link");
    playButton.classList.add("Playbtn");
    btn = 2;
});

playButton.addEventListener("click", () => {
    LoadingText.style.opacity = "1";
    MultiBtn.disabled = true;
    CompBtn.disabled = true;

    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        if (btn === 1) {
            window.location.href = "html/multi.html";
        } else if (btn === 2) {
            window.location.href = "html/comp.html";
        }
}, 1050);
});