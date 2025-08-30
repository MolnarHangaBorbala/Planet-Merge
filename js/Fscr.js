const { Engine, Render, Runner, World, Bodies, Events } = Matter;

// ------------------ STAR BACKGROUND ------------------
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');

function resizeStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}
resizeStars();
window.addEventListener('resize', resizeStars);

const starCount = 200;
const stars = [];
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        radius: Math.random() * 1.5 + 0.2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2
    });
}

function drawStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    const time = Date.now() * 0.002;
    for (let s of stars) {
        const alpha = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        starsCtx.beginPath();
        starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        starsCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        starsCtx.fill();
    }
    requestAnimationFrame(drawStars);
}
drawStars();

// ------------------ ENGINE & RENDER ------------------
const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.getElementById("game-container"),
    engine: engine,
    options: {
        width: 600,
        height: 800,
        wireframes: false,
        background: "rgba(255, 255, 255, 0.05)"
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// ------------------ WALLS ------------------
World.add(world, [
    Bodies.rectangle(300, 810, 800, 20, { isStatic: true }),
    Bodies.rectangle(-10, 400, 20, 1000, { isStatic: true }),
    Bodies.rectangle(610, 400, 20, 1000, { isStatic: true })
]);

// ------------------ PLANETS ------------------
const planetStages = [
    { radius: 20, color: "hsl(30,20%,60%)", type: "rock" },
    { radius: 35, color: "hsl(0,0%,50%)", type: "rock" },
    { radius: 50, color: "hsl(210,30%,60%)", type: "rock" },
    { radius: 65, color: "hsl(220,50%,55%)", type: "rock" },
    { radius: 80, color: "hsl(25,80%,50%)", type: "rock" },
    { radius: 95, color: "hsl(200,70%,45%)", type: "earth" },
    { radius: 115, color: "hsl(40,80%,55%)", type: "gas" },
    { radius: 135, color: "hsl(45,100%,60%)", type: "saturn" },
    { radius: 155, color: "hsl(15,80%,55%)", type: "star" },
    { radius: 170, color: "hsl(280,70%,50%)", type: "star" },
    { radius: 190, color: "hsl(0,0%,0%)", type: "blackhole" }
];

function createPlanetImage(planet) {
    const { radius, color, type } = planet;
    let canvasSize = radius * 2;
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");

    switch (type) {
        case "rock":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "rgba(0,0,0,0.2)";
            for (let i = 0; i < 5; i++) {
                const r = Math.random() * radius * 0.2;
                const x = radius + (Math.random() - 0.5) * radius * 1.5;
                const y = radius + (Math.random() - 0.5) * radius * 1.5;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case "gas":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();
            const stripeCount = 6;
            ctx.lineWidth = radius * 0.4;
            for (let i = 0; i < stripeCount; i++) {
                const stripeRadius = radius * 0.8 - i * radius * 0.1;
                ctx.beginPath();
                ctx.arc(radius, radius, stripeRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${0.2 - i * 0.02})`;
                ctx.stroke();
            }
            break;

        case "earth":
            const gradientEarth = ctx.createRadialGradient(radius, radius, radius * 0.3, radius, radius, radius);
            gradientEarth.addColorStop(0, "hsl(200, 80%, 60%)");
            gradientEarth.addColorStop(1, "hsla(200, 62%, 26%, 1.0)");
            ctx.fillStyle = gradientEarth;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "hsl(120, 60%, 40%)";
            for (let i = 0; i < 5; i++) {
                const cx = radius + (Math.random() - 0.5) * radius * 1.2;
                const cy = radius + (Math.random() - 0.5) * radius * 1.2;
                const w = radius * (0.2 + Math.random() * 0.15);
                const h = radius * (0.1 + Math.random() * 0.15);
                ctx.beginPath();
                ctx.ellipse(cx, cy, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = "rgba(255,255,255,0.2)";
            for (let i = 0; i < 8; i++) {
                const cx = radius + (Math.random() - 0.5) * radius * 1.2;
                const cy = radius + (Math.random() - 0.5) * radius * 1.2;
                const w = radius * 0.1 + Math.random() * 0.1 * radius;
                const h = radius * 0.05 + Math.random() * 0.05 * radius;
                ctx.beginPath();
                ctx.ellipse(cx, cy, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case "saturn":
            const ringPadding = radius * 0.8;
            canvasSize = (radius + ringPadding) * 2;
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            const center = canvasSize / 2;

            const ringCount = 3;
            const ringThickness = radius * 0.15;
            for (let i = 0; i < ringCount; i++) {
                const innerR = radius * 1.2 + i * ringThickness * 1.1;
                const outerR = innerR + ringThickness;

                const ringGradient = ctx.createRadialGradient(center, center, innerR, center, center, outerR);
                ringGradient.addColorStop(0, `rgba(200,200,150,${0.8 - i * 0.15})`);
                ringGradient.addColorStop(1, `rgba(160,160,120,${0.5 - i * 0.1})`);

                ctx.fillStyle = ringGradient;
                ctx.beginPath();
                ctx.arc(center, center, outerR, 0, Math.PI * 2);
                ctx.arc(center, center, innerR, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }

            const gradientSaturn = ctx.createRadialGradient(center, center, radius * 0.2, center, center, radius);
            gradientSaturn.addColorStop(0, "hsl(50, 25%, 75%)");
            gradientSaturn.addColorStop(1, "hsl(40, 30%, 65%)");
            ctx.fillStyle = gradientSaturn;
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "star":
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "blackhole":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 6; i++) {
                const ringRadius = radius * 0.5 + i * (radius * 0.08);
                ctx.beginPath();
                ctx.arc(radius, radius, ringRadius, 0, Math.PI * 2);
                ctx.lineWidth = radius * 0.06;
                const alpha = 0.15 - i * 0.02;
                ctx.strokeStyle = `rgba(255,255,255,${alpha > 0 ? alpha : 0})`;
                ctx.shadowColor = "white";
                ctx.shadowBlur = 10;
                ctx.stroke();
            }
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.beginPath();
            ctx.arc(radius, radius, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            break;
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

function spawnPlanet(x, stageIndex, y) {
    const stage = planetStages[stageIndex];
    const img = createPlanetImage(stage);

    const planet = Bodies.circle(x, y, stage.radius, { // use passed y
        restitution: 0.3,
        friction: 0.05,
        frictionAir: 0.001,
        label: "planet",
        render: {
            sprite: {
                texture: img.src,
                xScale: 1,
                yScale: 1
            }
        }
    });
    planet.stage = stageIndex;
    return planet;
}

// ------------------ PREVIEW OUTSIDE ------------------
let nextStageIndex = Math.floor(Math.random() * 5);
const previewCanvas = document.getElementById("next-planet-preview");
const previewCtx = previewCanvas.getContext("2d");

// Fix canvas size to match CSS
previewCanvas.width = previewCanvas.clientWidth;
previewCanvas.height = previewCanvas.clientHeight;

// Cache the preview image
let previewImg = null;
function updatePreviewImage() {
    const stage = planetStages[nextStageIndex];
    previewImg = createPlanetImage(stage);
    previewImg.onload = () => drawNextPlanetPreview();
}
function drawNextPlanetPreview() {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    if (!previewImg) return;
    const stage = planetStages[nextStageIndex];
    const scale = 0.8;
    previewCtx.drawImage(
        previewImg,
        previewCanvas.width / 2 - stage.radius * scale,
        previewCanvas.height / 2 - stage.radius * scale,
        stage.radius * 2 * scale,
        stage.radius * 2 * scale
    );
}
updatePreviewImage();

// When the next planet changes, update the preview
function setNextStageIndex(idx) {
    nextStageIndex = idx;
    updatePreviewImage();
}

// ------------------ SPAWN PLANET ON CLICK ------------------
let lastClickTime = 0;
const cooldown = 750;

render.canvas.addEventListener("mousedown", e => {
    const now = Date.now();
    if (now - lastClickTime < cooldown) return;
    lastClickTime = now;

    const rect = render.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    const stageIndex = nextStageIndex;
    const stage = planetStages[stageIndex];
    x = Math.max(stage.radius + 10, Math.min(x, 600 - 10 - stage.radius));

    const ufoY = 40, ufoH = 30;
    const beamH = 100;
    const topY = ufoY + ufoH / 2;
    const botY = topY + beamH;

    const scale = 0.8;
    const spawnY = botY - stage.radius * scale;

    World.add(world, spawnPlanet(x, stageIndex, spawnY));

    setNextStageIndex(Math.floor(Math.random() * 5));
});

// ------------------ COLLISIONS ------------------
Events.on(engine, "collisionStart", e => {
    e.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === "planet" && bodyB.label === "planet") {
            if (bodyA.stage === bodyB.stage && bodyA.stage < planetStages.length - 1) {
                const nextStage = bodyA.stage + 1;
                const img = createPlanetImage(planetStages[nextStage]);
                const newPlanet = Bodies.circle(
                    (bodyA.position.x + bodyB.position.x) / 2,
                    (bodyA.position.y + bodyB.position.y) / 2,
                    planetStages[nextStage].radius,
                    {
                        restitution: 0.2,
                        label: "planet",
                        render: {
                            sprite: {
                                texture: img.src,
                                xScale: 1,
                                yScale: 1
                            }
                        }
                    }
                );
                newPlanet.stage = nextStage;
                World.add(world, newPlanet);
                World.remove(world, bodyA);
                World.remove(world, bodyB);
            }
        }
    });
});

// ------------------ OVERLAY UFO ------------------
const overlayCanvas = document.getElementById('overlay-canvas');
const overlayCtx = overlayCanvas.getContext('2d');
overlayCanvas.width = 600;
overlayCanvas.height = 800;
let mouseX = null;

const container = document.getElementById('game-container');
container.addEventListener('mousemove', e => {
    const rect = overlayCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
});
container.addEventListener('mouseleave', () => mouseX = null);

(function drawOverlay() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    if (mouseX !== null) {
        overlayCtx.save();

        // --- Guideline ---
        overlayCtx.lineWidth = 2;
        overlayCtx.setLineDash([15, 10]);
        const gradient = overlayCtx.createLinearGradient(0, 0, 0, overlayCanvas.height);
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.2, "rgba(255,255,255,0.5)");
        gradient.addColorStop(0.8, "rgba(255,255,255,0.5)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        overlayCtx.strokeStyle = gradient;
        overlayCtx.beginPath();
        overlayCtx.moveTo(mouseX, 0);
        overlayCtx.lineTo(mouseX, overlayCanvas.height);
        overlayCtx.stroke();

        // --- UFO ---
        const ufoY = 40, ufoW = 120, ufoH = 40;
        overlayCtx.fillStyle = "rgba(160,160,160,1)";
        overlayCtx.beginPath();
        overlayCtx.ellipse(mouseX, ufoY, ufoW / 2, ufoH / 2, 0, 0, Math.PI * 2);
        overlayCtx.fill();

        overlayCtx.fillStyle = "rgba(100,201,255,0.83)";
        overlayCtx.beginPath();
        overlayCtx.arc(mouseX, ufoY - 5, ufoH / 2, Math.PI, 0, false);
        overlayCtx.fill();

        // --- Tractor beam ---
        const beamTopW = 20, beamBotW = 50, beamH = 100;
        const topY = ufoY + ufoH / 2, botY = topY + beamH;
        overlayCtx.fillStyle = "rgba(0,255,0,0.15)";
        overlayCtx.beginPath();
        overlayCtx.moveTo(mouseX - beamTopW / 2, topY);
        overlayCtx.lineTo(mouseX + beamTopW / 2, topY);
        overlayCtx.lineTo(mouseX + beamBotW / 2, botY);
        overlayCtx.lineTo(mouseX - beamBotW / 2, botY);
        overlayCtx.closePath();
        overlayCtx.fill();

        overlayCtx.restore();
    }
    requestAnimationFrame(drawOverlay);
})();