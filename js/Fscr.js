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
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1
    });
}

function drawStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    const time = Date.now() * 0.002;

    for (let s of stars) {
        const alpha = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset);

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = starsCanvas.width;
        if (s.x > starsCanvas.width) s.x = 0;
        if (s.y < 0) s.y = starsCanvas.height;
        if (s.y > starsCanvas.height) s.y = 0;

        starsCtx.beginPath();
        starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        starsCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        starsCtx.fill();
    }

    requestAnimationFrame(drawStars);
}
drawStars();

// ------------------ PLANET SIZE BOX ------------------
const sizeCanvas = document.getElementById("planet-size-canvas");
const sizeCtx = sizeCanvas.getContext("2d");

function drawPlanetSizeBox() {
    const xPad = 12;
    const yPad = 12;
    const spacing = 10;

    let totalHeight = yPad;
    for (const stage of planetStages) {
        const scale = 0.5;
        totalHeight += stage.radius * 2 * scale + spacing;
    }

    const dpr = window.devicePixelRatio || 1;
    sizeCanvas.width = sizeCanvas.clientWidth * dpr;
    sizeCanvas.height = totalHeight * dpr;
    sizeCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // fix HiDPI

    sizeCtx.clearRect(0, 0, sizeCanvas.width, sizeCanvas.height);

    let y = yPad;

    for (const stage of planetStages) {
        const img = createPlanetImage(stage);
        const scale = 0.5;
        const w = stage.radius * 2 * scale;
        const h = w;
        const labelX = xPad + w + 8;
        const targetY = y;

        const paint = () => {
            sizeCtx.drawImage(img, xPad, targetY, w, h);
            sizeCtx.fillStyle = "white";
            sizeCtx.font = "12px system-ui, Arial";
            sizeCtx.textBaseline = "middle";
            sizeCtx.fillText(`${stage.name} (${stage.points} pts)`, labelX, targetY + h / 2);
        };

        if (img.complete) paint();
        else img.onload = paint;

        y += h + spacing;
    }
}

window.addEventListener("load", drawPlanetSizeBox);
window.addEventListener("resize", drawPlanetSizeBox);

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
    { radius: 20, color: "hsl(30,20%,60%)", type: "rock", name: "Ceres", points: "10" },
    { radius: 35, color: "hsl(0,0%,50%)", type: "rock", name: "Vesta", points: "20" },
    { radius: 50, color: "hsl(210,30%,60%)", type: "rock", name: "Pallas", points: "40" },
    { radius: 65, color: "hsl(220,50%,55%)", type: "rock", name: "Hygiea", points: "80" },
    { radius: 80, color: "hsl(25,80%,50%)", type: "rock", name: "Mars", points: "160" },
    { radius: 95, color: "hsl(200,70%,45%)", type: "earth", name: "Earth", points: "320" },
    { radius: 115, color: "hsl(40,80%,55%)", type: "gas", name: "Jupiter", points: "640" },
    { radius: 135, color: "hsl(45, 50%, 52%)", type: "saturn", name: "Saturn", points: "1,280" },
    { radius: 155, color: "hsl(15,80%,55%)", type: "star", name: "Solara", points: "2,560" },
    { radius: 170, color: "hsl(280,70%,50%)", type: "star", name: "Rigel", points: "5,120" },
    { radius: 190, color: "hsl(0,0%,0%)", type: "blackhole", name: "Abyss", points: "10,240" }
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
            // shading
            const gradRock = ctx.createRadialGradient(radius * 0.6, radius * 0.6, radius * 0.2, radius, radius, radius);
            gradRock.addColorStop(0, color);
            gradRock.addColorStop(1, "hsl(0,0%,15%)");
            ctx.fillStyle = gradRock;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            // craters
            for (let i = 0; i < 6; i++) {
                const r = Math.random() * radius * 0.15 + 2;
                const x = radius + (Math.random() - 0.5) * radius * 1.4;
                const y = radius + (Math.random() - 0.5) * radius * 1.4;

                const craterGrad = ctx.createRadialGradient(x - r / 2, y - r / 2, r * 0.2, x, y, r);
                craterGrad.addColorStop(0, "rgba(255,255,255,0.15)");
                craterGrad.addColorStop(1, "rgba(0,0,0,0.4)");

                ctx.fillStyle = craterGrad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case "gas":
            const gradGas = ctx.createRadialGradient(radius * 0.8, radius * 0.8, radius * 0.2, radius, radius, radius);
            gradGas.addColorStop(0, color);
            gradGas.addColorStop(1, "hsl(210,30%,15%)");
            ctx.fillStyle = gradGas;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "earth": {
            // --- Base ocean gradient ---
            const gradientEarth = ctx.createRadialGradient(
                radius * 0.6, radius * 0.6, radius * 0.3,
                radius, radius, radius
            );
            gradientEarth.addColorStop(0, "hsl(200, 80%, 60%)");  // lighter ocean
            gradientEarth.addColorStop(1, "hsl(200, 62%, 20%)");  // deep ocean
            ctx.fillStyle = gradientEarth;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            // --- Landmasses ---
            ctx.fillStyle = "hsl(120, 55%, 35%)";
            for (let i = 0; i < 7; i++) {
                const cx = radius + (Math.random() - 0.5) * radius * 1.4;
                const cy = radius + (Math.random() - 0.5) * radius * 1.4;
                ctx.beginPath();
                ctx.ellipse(cx, cy, radius * 0.25, radius * 0.12, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- Clouds ---
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            for (let i = 0; i < 10; i++) {
                const cx = radius + (Math.random() - 0.5) * radius * 1.3;
                const cy = radius + (Math.random() - 0.5) * radius * 1.3;
                ctx.beginPath();
                ctx.ellipse(cx, cy, radius * (0.1 + Math.random() * 0.15), radius * (0.05 + Math.random() * 0.08), Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- Polar ice caps ---
            ctx.save();
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.clip();

            const iceGradNorth = ctx.createLinearGradient(0, 0, 0, radius);
            iceGradNorth.addColorStop(0, "rgba(255,255,255,0.8)");
            iceGradNorth.addColorStop(1, "transparent");
            ctx.fillStyle = iceGradNorth;
            ctx.fillRect(0, 0, radius * 2, radius);  // north half

            const iceGradSouth = ctx.createLinearGradient(0, radius, 0, radius * 2);
            iceGradSouth.addColorStop(0, "transparent");
            iceGradSouth.addColorStop(1, "rgba(255,255,255,0.8)");
            ctx.fillStyle = iceGradSouth;
            ctx.fillRect(0, radius, radius * 2, radius);  // south half
            ctx.restore();

            // --- Atmosphere glow ---
            const atmosphere = ctx.createRadialGradient(
                radius, radius, radius * 0.95,
                radius, radius, radius * 1.2
            );
            atmosphere.addColorStop(0, "rgba(0,180,255,0.25)");
            atmosphere.addColorStop(1, "rgba(0,180,255,0)");
            ctx.fillStyle = atmosphere;
            ctx.beginPath();
            ctx.arc(radius, radius, radius * 1.2, 0, Math.PI * 2);
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
            const ringThickness = radius * 0.10;
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
            gradientSaturn.addColorStop(0, color);
            gradientSaturn.addColorStop(1, "hsla(0, 0%, 27%, 1.00)");
            ctx.fillStyle = gradientSaturn;
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "star": {
            const coreColor = color;
            const outerColor = "rgba(255,255,255,0.05)";
            const streakColor = "rgba(255,255,255,0.2)";

            const grad = ctx.createRadialGradient(radius, radius, radius * 0.2, radius, radius, radius);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.2, coreColor);
            grad.addColorStop(1, outerColor);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowColor = "rgba(255,255,255,0.1)";
            ctx.shadowBlur = radius * 0.2;
            ctx.beginPath();
            ctx.arc(radius, radius, radius * 0.95, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 / 6) * i;
                const len = radius * (0.8 + Math.random() * 0.3);
                const x1 = radius + Math.cos(angle) * radius * 0.2;
                const y1 = radius + Math.sin(angle) * radius * 0.2;
                const x2 = radius + Math.cos(angle) * len;
                const y2 = radius + Math.sin(angle) * len;

                const streakGrad = ctx.createLinearGradient(x1, y1, x2, y2);
                streakGrad.addColorStop(0, "rgba(255,255,255,0.5)");
                streakGrad.addColorStop(1, "rgba(255,255,255,0)");

                ctx.strokeStyle = streakGrad;
                ctx.lineWidth = radius * 0.02;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
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

    const planet = Bodies.circle(x, y, stage.radius, {
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

previewCanvas.width = previewCanvas.clientWidth;
previewCanvas.height = previewCanvas.clientHeight;

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

function setNextStageIndex(idx) {
    nextStageIndex = idx;
    updatePreviewImage();
}

// ------------------ SPAWN PLANET ON CLICK ------------------
let lastClickTime = 0;
const cooldown = 750;

render.canvas.addEventListener("mousedown", e => {
    render.canvas.addEventListener("mousedown", e => {
        const now = Date.now();
        if (now - lastClickTime < cooldown) return;
        lastClickTime = now;

        const rect = render.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        const stageIndex = nextStageIndex;
        const stage = planetStages[stageIndex];
        x = Math.max(stage.radius + 10, Math.min(x, 600 - 10 - stage.radius));

        const lineY = 40 + 30 / 2 + 15;

        const spawnY = lineY + stage.radius + 15;

        World.add(world, spawnPlanet(x, stageIndex, spawnY));

        setNextStageIndex(Math.floor(Math.random() * 5));
    });
});

// ------------------ SCORE ------------------
let score = 0;
const scoreDisplay = document.getElementById("score");

function updateScoreDisplay() {
    scoreDisplay.textContent = score.toLocaleString() + "pts";
}

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
                    }
                );
                newPlanet.stage = nextStage;
                World.add(world, newPlanet);

                const points = parseInt(planetStages[nextStage].points.replace(/,/g, ""));
                score += points;
                updateScoreDisplay();

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

        // --- UFO realistic look ---
        const ufoY = 40, ufoW = 120, ufoH = 40;

        // metallic body (ellipse with gradient)
        let bodyGrad = overlayCtx.createLinearGradient(mouseX - ufoW / 2, ufoY, mouseX + ufoW / 2, ufoY);
        bodyGrad.addColorStop(0, "#222");   // dark steel
        bodyGrad.addColorStop(0.5, "#888"); // highlight
        bodyGrad.addColorStop(1, "#222");   // dark steel
        overlayCtx.fillStyle = bodyGrad;
        overlayCtx.beginPath();
        overlayCtx.ellipse(mouseX, ufoY, ufoW / 2, ufoH / 2, 0, 0, Math.PI * 2);
        overlayCtx.fill();

        // subtle rim shading
        overlayCtx.strokeStyle = "rgba(255,255,255,0.2)";
        overlayCtx.lineWidth = 2;
        overlayCtx.stroke();

        // dome (glass canopy with reflection)
        let domeGrad = overlayCtx.createRadialGradient(mouseX, ufoY - 10, 5, mouseX, ufoY - 10, ufoH / 1.2);
        domeGrad.addColorStop(0, "rgba(200, 230, 255, 0.8)");  // inner bright
        domeGrad.addColorStop(1, "rgba(100, 140, 180, 0.3)"); // outer fade
        overlayCtx.fillStyle = domeGrad;
        overlayCtx.beginPath();
        overlayCtx.arc(mouseX, ufoY - 5, ufoH / 2, Math.PI, 0, false);
        overlayCtx.fill();

        // dome reflection streak
        overlayCtx.strokeStyle = "rgba(255,255,255,0.6)";
        overlayCtx.lineWidth = 1.5;
        overlayCtx.beginPath();
        overlayCtx.arc(mouseX - 10, ufoY - 12, 12, Math.PI * 0.8, Math.PI * 1.3);
        overlayCtx.stroke();

        // glowing rim lights (subtle, white-blue)
        for (let i = -2; i <= 2; i++) {
            let lightGrad = overlayCtx.createRadialGradient(mouseX + i * 20, ufoY + ufoH / 4, 2, mouseX + i * 20, ufoY + ufoH / 4, 6);
            lightGrad.addColorStop(0, "rgba(180,220,255,0.9)");
            lightGrad.addColorStop(1, "rgba(180,220,255,0)");
            overlayCtx.fillStyle = lightGrad;
            overlayCtx.beginPath();
            overlayCtx.arc(mouseX + i * 20, ufoY + ufoH / 4, 6, 0, Math.PI * 2);
            overlayCtx.fill();
        }

        // --- Tractor beam (more realistic) ---
        const beamTopW = 20, beamBotW = 80, beamH = 90;
        const topY = ufoY + ufoH / 2, botY = topY + beamH;

        let beamGrad = overlayCtx.createLinearGradient(mouseX, topY, mouseX, botY);
        beamGrad.addColorStop(0, "rgba(0, 255, 180, 0.25)");
        beamGrad.addColorStop(1, "rgba(0, 120, 255, 0.05)");

        overlayCtx.fillStyle = beamGrad;
        overlayCtx.beginPath();
        overlayCtx.moveTo(mouseX - beamTopW / 2, topY);
        overlayCtx.lineTo(mouseX + beamTopW / 2, topY);
        overlayCtx.lineTo(mouseX + beamBotW / 2, botY);
        overlayCtx.lineTo(mouseX - beamBotW / 2, botY);
        overlayCtx.closePath();
        overlayCtx.fill();

        overlayCtx.restore();
    }

    // --- Fixed dotted line under UFO ---
    const lineY = 40 + 30 / 2 + 15;
    overlayCtx.setLineDash([5, 5]);
    overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.4)";
    overlayCtx.lineWidth = 4;
    overlayCtx.beginPath();
    overlayCtx.moveTo(0, lineY);
    overlayCtx.lineTo(overlayCanvas.width, lineY);
    overlayCtx.stroke();
    overlayCtx.setLineDash([]);

    requestAnimationFrame(drawOverlay);
})();


// ------------------ GAME OVER CHECK ------------------
let gameOverTriggered = false;

function checkGameOver() {
    if (gameOverTriggered) return;

    const lineY = 40 + 30 / 2 + 15;

    const touchingPlanets = world.bodies.filter(p =>
        p.label === "planet" && Math.abs(p.position.y - lineY) < p.circleRadius
    );

    if (touchingPlanets.length > 0) {
        gameOverTriggered = true;
        startAllPlanetsShake();
    }
}

Events.on(engine, "beforeUpdate", () => {
    checkGameOver();
});

function resetGameOver() {
    gameOverTriggered = false;
}

function startAllPlanetsShake() {
    const planets = world.bodies.filter(b => b.label === "planet");
    const originalPositions = planets.map(p => ({ x: p.position.x, y: p.position.y }));
    const start = Date.now();
    const shakeDuration = 3000;

    const shakeInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        if (elapsed > shakeDuration) {
            planets.forEach((planet) => {
                const stage = planetStages[planet.stage];
                const points = parseInt(stage.points.replace(/,/g, ""));
                score += points;
                World.remove(world, planet);
            });
            updateScoreDisplay();

            score = 0;
            updateScoreDisplay();

            clearInterval(shakeInterval);
            return;
        }

        planets.forEach((planet, index) => {
            Matter.Body.setVelocity(planet, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(planet, 0);

            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            Matter.Body.setPosition(planet, {
                x: originalPositions[index].x + offsetX,
                y: originalPositions[index].y + offsetY
            });
        });
    }, 50);
}