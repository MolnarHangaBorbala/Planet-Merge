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
