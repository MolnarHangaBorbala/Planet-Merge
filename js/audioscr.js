const clickSound = document.getElementById("clickSound");
const menuBgMusic = document.getElementById("BgMusic");
const targets = document.querySelectorAll('.sound-class');
const speakerIcon = document.getElementById("speakerIcon");

menuBgMusic.volume = 0.15;
menuBgMusic.loop = true;

targets.forEach(item => {
    item.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

function speaker() {
    if (menuBgMusic.paused) {
        menuBgMusic.play();
        speakerIcon.src = "../img/icons/speakerBtn.png";
    } else {
        menuBgMusic.pause();
        speakerIcon.src = "../img/icons/muteBtn.png";
    }
}