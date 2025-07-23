const sound = document.getElementById("hoverSound");
const targets = document.querySelectorAll('.sound-class');

targets.forEach(item => {
    item.addEventListener("click", () => {
        sound.currentTime = 0;
        sound.play();
    });
});