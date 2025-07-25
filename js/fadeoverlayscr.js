window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('fadeOverlay');

    setTimeout(() => {
        overlay.classList.remove('fade-out');
        overlay.classList.add('fade-in');
    }, 50);
});


function home() {
    const overlay = document.getElementById('fadeOverlay');

    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1050);
}

/* Full Screen--------------------------------------------------------------- */
const OuterContID = document.getElementById("OuterContID");

function isMaybeF11Fullscreen() {
    return window.innerHeight === screen.height || window.outerHeight === screen.height;
}

window.addEventListener("resize", () => {
    if (isMaybeF11Fullscreen()) {
        console.log("User likely pressed F11 for fullscreen.");
        OuterContID.style.marginTop = "150px";
    } else {
        console.log("Not in F11 fullscreen.");
        OuterContID.style.marginTop = "60px";
    }
});