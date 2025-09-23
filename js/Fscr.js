const { Engine, Render, Runner, World, Bodies, Events } = Matter;

// ------------------ INPUT LOCK ------------------
let inputLocked = false;

// ------------------ TRACK LARGEST PLANET ------------------
let largestPlanetReached = 0;
function updateLargestPlanet(stageIndex) {
    if (stageIndex > largestPlanetReached) {
        largestPlanetReached = stageIndex;
    }
}

// ------------------ AUDIO ------------------
const mergeSound = document.getElementById("merge-sfx");
const gameOverSound = document.getElementById("game-over-sfx");
const spawnSound = document.getElementById("spawn-sfx");
const softClickSound = document.getElementById("soft-click-sfx");
const bgMusic = document.getElementById("bg-music");

const soundIcon = document.getElementById("sound-icon");
const soundContainer = document.getElementById("eq-id");

bgMusic.volume = 0;
let paused = false;
soundContainer.classList.add("paused");

function toggleSound() {
    if (!paused) {
        bgMusic.play();
        soundIcon.src = "../img/sound-on.png";
        soundIcon.style.width = "50px";
        soundContainer.classList.remove("paused");

        fadeVolume(bgMusic, 0.8, 750);
        paused = true;
    } else {
        fadeVolume(bgMusic, 0, 750);
        soundIcon.src = "../img/sound-off.png";
        soundIcon.style.width = "32px";
        soundContainer.classList.add("paused");

        paused = false;
    }
}

function playMSFX() {
    try {
        mergeSound.volume = 0.5;
        mergeSound.currentTime = 0;
        mergeSound.play();
    } catch (e) { }
}

function playGOSFX() {
    try {
        if (!playGOSFX.played) {
            playGOSFX.played = true;
            fadeVolume(bgMusic, 0.2, 1000);
            gameOverSound.volume = 0.5;
            gameOverSound.currentTime = 0;
            gameOverSound.play();
            setTimeout(() => {
                fadeVolume(bgMusic, 0.8, 1000);
            }, 4000);
        }
    } catch (e) { }
}
function resetGOSFX() { playGOSFX.played = false; }

function playSSFX() {
    try {
        spawnSound.volume = 0.4;
        spawnSound.currentTime = 0;
        spawnSound.play();
    } catch (e) { }
}

function playSCSFX() {
    try {
        softClickSound.volume = 0.5;
        softClickSound.currentTime = 0;
        softClickSound.play();
    } catch (e) { }
}

// ------------------ VOLUME FADE ------------------
function fadeVolume(audio, targetVolume, duration = 1000) {
    const startVolume = audio.volume;
    const delta = targetVolume - startVolume;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
        audio.volume = startVolume + delta * eased;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else if (targetVolume === 0) {
            audio.pause();
        }
    }

    requestAnimationFrame(tick);
}

// ------------------ CURSOR ------------------
const cursor = document.querySelector(".custom-cursor");
document.addEventListener("mousemove", (e) => {
    cursor.style.top = e.clientY + "px";
    cursor.style.left = e.clientX + "px";
});
// ------------------------------------

// remember toggle in localStorage
let useRealisticPhysics = localStorage.getItem("useRealisticPhysics") === "true";

const physicText = document.getElementById("physicT");
function updatePhysicsText() {
    physicText.textContent = useRealisticPhysics ? "Realistic" : "Arcade";
}
updatePhysicsText();
let currentGameMode = localStorage.getItem("useRealisticPhysics") === "true" ? "realistic" : "arcade";

// Update toggle button listener
document.getElementById("toggle-physics").addEventListener("click", () => {
    useRealisticPhysics = !useRealisticPhysics;
    localStorage.setItem("useRealisticPhysics", useRealisticPhysics);

    currentGameMode = useRealisticPhysics ? "realistic" : "arcade";
    playSCSFX();
    alert("Physics mode: " + (useRealisticPhysics ? "Realistic" : "Arcade"));
    updatePhysicsText();
    initPhysics();
    updateLeaderboardDisplay(); // refresh leaderboard immediately
});

// ------------------ PLANETS ------------------
const planetStages = [
    { radius: 20, color: "hsl(30,20%,60%)", type: "rock", name: "Ceres", points: "10" },
    { radius: 35, color: "hsl(0,0%,50%)", type: "rock", name: "Vesta", points: "20" },
    { radius: 50, color: "hsl(210,30%,60%)", type: "rock", name: "Pallas", points: "40" },
    { radius: 65, color: "hsl(220,50%,55%)", type: "rock", name: "Hygiea", points: "80" },
    { radius: 75, color: "hsl(25,80%,50%)", type: "rock", name: "Mars", points: "160" },
    { radius: 85, color: "hsl(200,70%,45%)", type: "earth", name: "Earth", points: "320" },
    { radius: 95, color: "hsla(40, 64%, 45%, 1.00)", type: "gas", name: "Jupiter", points: "640" },
    { radius: 115, color: "hsla(45, 36%, 55%, 1.00)", type: "saturn", name: "Saturn", points: "1,280" },
    { radius: 135, color: "hsl(15,80%,55%)", type: "star", name: "Solara", points: "2,560" },
    { radius: 150, color: "hsl(280,70%,50%)", type: "star", name: "Rigel", points: "5,120" },
    { radius: 170, color: "hsl(0,0%,0%)", type: "blackhole", name: "Abyss", points: "10,240" }
];

// ------------------ SCORE ------------------
let score = 0;
let displayedScore = 0;
const scoreDisplay = document.getElementById("score");

function updateScoreDisplay() {
    if (displayedScore !== score) {
        displayedScore += Math.round((score - displayedScore) * 0.03);
        if (Math.abs(score - displayedScore) < 2) displayedScore = score;
    }
    scoreDisplay.textContent = displayedScore.toLocaleString() + "pts";
    if (displayedScore !== score) {
        requestAnimationFrame(updateScoreDisplay);
    }
}
window.updateScoreDisplay = updateScoreDisplay;

// ------------------ ENGINE & RENDER ------------------
let engine, world, render;
let runner = null;
let collisionHandler = null;
let beforeUpdateHandler = null;
let spawnHandler = null;

function handleSpawn(e) {
    if (inputLocked) return;

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
    checkGameOver();
}

function applyGravityPull(source, bodies, strength) {
    if (!source || !bodies) return;

    for (let other of bodies) {
        if (!other || other === source) continue;

        const dx = source.position.x - other.position.x;
        const dy = source.position.y - other.position.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 1) continue;

        const force = Math.min(strength / distSq, 0.0008);
        Matter.Body.applyForce(other, other.position, {
            x: dx * force,
            y: dy * force
        });
    }
}

function absorbNearbyPlanets(blackhole, planets) {
    if (!blackhole || !planets) return;

    for (let p of planets) {
        if (!p || p === blackhole) continue;

        const dx = blackhole.position.x - p.position.x;
        const dy = blackhole.position.y - p.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < blackhole.circleRadius + p.circleRadius) {
            // safely remove planet
            World.remove(world, p);
        }
    }
}

let deleteUses = 0;
const deleteBTN = document.getElementById("delete-s-planets");
function DISABLE() {
    if (deleteUses <= 0) return; // Prevent use if no uses left

    // Only proceed if there are planets to delete
    const planets = world.bodies.filter(b => b.label === "planet" && b.stage >= 0 && b.stage <= 2);
    if (planets.length === 0) return;

    playSCSFX();
    for (let p of planets) {
        World.remove(world, p);
    }
    deleteUses--;
    updateDeleteButtonLabel();
}

function initPhysics() {
    if (engine) {
        try { if (runner) Runner.stop(runner); } catch (err) { }
        try { Render.stop(render); } catch (err) { }

        try {
            if (render && render.canvas && spawnHandler) {
                render.canvas.removeEventListener("mousedown", spawnHandler);
            }
        } catch (err) { }

        try {
            if (engine && collisionHandler) Events.off(engine, "collisionStart", collisionHandler);
            if (engine && beforeUpdateHandler) Events.off(engine, "beforeUpdate", beforeUpdateHandler);
        } catch (err) { }

        try { World.clear(world, false); } catch (err) { }
        try { Engine.clear(engine); } catch (err) { }

        try { if (render && render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas); } catch (err) { }
    }

    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = useRealisticPhysics ? 0.25 : 1;

    if (useRealisticPhysics && typeof enableRealisticPhysics === "function") {
        enableRealisticPhysics(engine, world, planetStages, updateScoreDisplay, function (pts) {
            score += pts;
            updateScoreDisplay();
        });
    }

    render = Render.create({
        element: document.getElementById("game-container"),
        engine: engine,
        options: { width: 600, height: 800, wireframes: false, background: "rgba(255,255,255,0.05)" }
    });

    runner = Runner.create();
    Render.run(render);
    Runner.run(runner, engine);

    World.add(world, [
        Bodies.rectangle(300, 810, 800, 20, { isStatic: true }),
        Bodies.rectangle(-10, 400, 20, 1000, { isStatic: true }),
        Bodies.rectangle(610, 400, 20, 1000, { isStatic: true })
    ]);

    // --- collisions ---
    collisionHandler = function (e) {
        e.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;

            if (bodyA.label === "planet" && bodyB.label === "planet") {

                // Special: merge two Rigels into blackhole
                if (bodyA.stage === 9 && bodyB.stage === 9) {
                    const stageData = planetStages[10];
                    const img = createPlanetImage(stageData);

                    const blackhole = Bodies.circle(
                        (bodyA.position.x + bodyB.position.x) / 2,
                        (bodyA.position.y + bodyB.position.y) / 2,
                        stageData.radius,
                        {
                            restitution: 0,
                            friction: 1,
                            frictionAir: 0,
                            label: "planet",
                            render: { sprite: { texture: img.src, xScale: 1, yScale: 1 } }
                        }
                    );
                    blackhole.stage = 10;
                    blackhole.specialEffect = "blackhole";
                    updateLargestPlanet(10);

                    World.add(world, blackhole);
                    playMSFX();

                    // Remove the two Rigels
                    World.remove(world, bodyA);
                    World.remove(world, bodyB);

                    // --- Freeze all planets and shake ---
                    const planets = world.bodies.filter(p => p.label === "planet");
                    const originalPositions = planets.map(p => ({ x: p.position.x, y: p.position.y }));
                    const start = Date.now();
                    const shakeDuration = 3000;

                    const shakeInterval = setInterval(() => {
                        const elapsed = Date.now() - start;
                        if (elapsed > shakeDuration) {
                            planets.forEach(p => {
                                World.remove(world, p);
                            });
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

                    return;
                }

                if (bodyA.stage === bodyB.stage && bodyA.stage < planetStages.length - 1) {
                    const nextStage = bodyA.stage + 1;
                    const stageData = planetStages[nextStage];
                    const img = createPlanetImage(stageData);

                    const newPlanet = Bodies.circle(
                        (bodyA.position.x + bodyB.position.x) / 2,
                        (bodyA.position.y + bodyB.position.y) / 2,
                        stageData.radius,
                        {
                            restitution: 0.2,
                            friction: 0.05,
                            frictionAir: 0.001,
                            label: "planet",
                            render: { sprite: { texture: img.src, xScale: 1, yScale: 1 } }
                        }
                    );
                    newPlanet.stage = nextStage;
                    updateLargestPlanet(nextStage);

                    if (stageData.type === "blackhole") {
                        newPlanet.specialEffect = "blackhole";
                    }

                    World.add(world, newPlanet);

                    if (nextStage === 8) {
                        deleteBTN.classList.remove("disabled");
                        deleteUses++;
                        updateDeleteButtonLabel();
                    }

                    const points = parseInt(stageData.points.replace(/,/g, ""));
                    score += points;
                    updateScoreDisplay();
                    playMSFX();

                    World.remove(world, bodyA);
                    World.remove(world, bodyB);
                }
            }
        });
    };


    Events.on(engine, "collisionStart", collisionHandler);

    // --- beforeUpdate (game over check) ---
    beforeUpdateHandler = () => {
        checkGameOver();

        const planets = world.bodies.filter(b => b.label === "planet");
        for (let p of planets) {
            if (!p) continue;

            switch (p.specialEffect) {
                case "weakGravity":
                    applyGravityPull(p, planets, 0.00002);
                    break;
                case "repelRing":
                    applyGravityPull(p, planets, -0.00005);
                    break;
                case "strongGravity":
                    applyGravityPull(p, planets, 0.0001);
                    break;
                case "blackhole":
                    applyGravityPull(p, planets, 0.0005);
                    absorbNearbyPlanets(p, planets);
                    break;
            }
        }
    };

    Events.on(engine, "beforeUpdate", beforeUpdateHandler);

    spawnHandler = handleSpawn;
    render.canvas.addEventListener("mousedown", spawnHandler);
}
initPhysics();
deleteBTN.addEventListener("mouseenter", () => {
    if (!deleteBTN.classList.contains("disabled")) {
        const planets = world.bodies.filter(b => b.label === "planet" && b.stage >= 0 && b.stage <= 2);
        for (let p of planets) {
            p.render.outline = "hotpink";
            p.render.outlineWidth = 3;
        }
    }
});

deleteBTN.addEventListener("mouseleave", () => {
    const planets = world.bodies.filter(b => b.label === "planet" && b.stage >= 0 && b.stage <= 2);
    for (let p of planets) {
        p.render.outline = null;
        p.render.outlineWidth = 0;
    }
});

function updateDeleteButtonLabel() {
    const deleteT = document.getElementById("deleteT");
    deleteT.textContent = `Delete |${deleteUses}|`;
    if (deleteUses <= 0) {
        deleteBTN.classList.add("disabled");
    } else {
        deleteBTN.classList.remove("disabled");
    }
}
updateDeleteButtonLabel();

// ------------------ PLANET SIZE BOX ------------------
// Draws the planet progression list on the left
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
            sizeCtx.font = "14px monospace";
            sizeCtx.textBaseline = "middle";
            sizeCtx.fillText(`${stage.name} (${stage.points}pts)`, labelX, targetY + h / 2);
        };

        if (img.complete) paint();
        else img.onload = paint;

        y += h + spacing;
    }
}

window.addEventListener("load", drawPlanetSizeBox);
window.addEventListener("resize", drawPlanetSizeBox);

// Creates a planet image for rendering, based on its type
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
                radius, radius, radius * 1.1
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
//---------------------------------------------------

function createRealisticPlanet(stageIndex, x, y, stages) {
    const stage = stages[stageIndex];
    const img = createPlanetImage(stage);

    const baseDensity = 0.000008;
    let density = baseDensity * Math.pow(stage.radius, 2);
    let restitution = 0.35;
    let friction = 0.02;
    let frictionAir = 0.0007;

    let specialEffect = null;

    switch (stage.type) {
        case "rock":
            restitution = 0.40;
            friction = 0.02;
            break;

        case "earth":
            friction = 0.03;
            frictionAir = 0.001;
            restitution = 0.38;
            break;

        case "gas":
            density *= 1.1;
            restitution = 0.45;
            frictionAir = 0.0005;
            specialEffect = "weakGravity";
            break;

        case "saturn":
            density *= 1.2;
            restitution = 0.42;
            frictionAir = 0.0008;
            specialEffect = "repelRing";
            break;

        case "star":
            density *= 2.0;
            restitution = 0.30;
            frictionAir = 0.001;
            specialEffect = "strongGravity";
            break;

        case "blackhole":
            density *= 10;
            restitution = 0.05;
            friction = 0.5;
            frictionAir = 0.001;
            specialEffect = "blackhole";
            break;
    }

    const planet = Bodies.circle(x, y, stage.radius, {
        density,
        restitution,
        friction,
        frictionAir,
        inertia: Infinity,
        label: "planet",
        render: {
            sprite: { texture: img.src, xScale: 1, yScale: 1 }
        }
    });

    planet.stage = stageIndex;
    planet.specialEffect = specialEffect;

    const spin = (Math.random() - 0.5) * 0.02;
    Matter.Body.setAngularVelocity(planet, spin);

    return planet;
}
//---------------------------------------------------
function spawnPlanet(x, stageIndex, y) {
    updateLargestPlanet(stageIndex);
    if (useRealisticPhysics) {
        return createRealisticPlanet(stageIndex, x, y, planetStages);
    } else {
        const stage = planetStages[stageIndex];
        const img = createPlanetImage(stage);
        const planet = Bodies.circle(x, y, stage.radius, {
            restitution: 0.3,
            friction: 0.05,
            frictionAir: 0.001,
            label: "planet",
            render: { sprite: { texture: img.src, xScale: 1, yScale: 1 } }
        });
        planet.stage = stageIndex;
        playSSFX();
        return planet;
    }
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
    const scale = 1;
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
    if (inputLocked) return;

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

    checkGameOver();
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

        // --- Tractor beam ---
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

    const planets = world.bodies.filter(p => p.label === "planet");
    for (const planet of planets) {
        if (planet.render.outline) {
            overlayCtx.save();
            overlayCtx.beginPath();
            overlayCtx.arc(planet.position.x, planet.position.y, planet.circleRadius + 2, 0, 2 * Math.PI);
            overlayCtx.strokeStyle = planet.render.outline;
            overlayCtx.lineWidth = planet.render.outlineWidth || 3;
            overlayCtx.shadowColor = planet.render.outline;
            overlayCtx.shadowBlur = 8;
            overlayCtx.stroke();
            overlayCtx.restore();
        }
    }

    requestAnimationFrame(drawOverlay);
})();

// ------------------ GAME OVER CHECK ------------------
let gameOverTriggered = false;

function checkGameOver() {
    if (gameOverTriggered) return;

    const lineY = 40 + 30 / 2 + 15;

    const passingPlanets = world.bodies.filter(p =>
        p.label === "planet" &&
        (p.position.y - p.circleRadius) < lineY
    );

    if (passingPlanets.length > 0) {
        gameOverTriggered = true;
        playGOSFX();
        startAllPlanetsShake();
    }
}

Events.on(engine, "beforeUpdate", () => {
    checkGameOver();
});

function resetGameOver() {
    gameOverTriggered = false;
    resetGOSFX();
    inputLocked = false;
}

// Shakes all planets, then clears them and resets score
function startAllPlanetsShake() {
    inputLocked = true;
    const planets = world.bodies.filter(b => b.label === "planet");
    const originalPositions = planets.map(p => ({ x: p.position.x, y: p.position.y }));
    const start = Date.now();
    const shakeDuration = 3000;
    cursor.classList.add("noCursor");

    const shakeInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        if (elapsed > shakeDuration) {
            planets.forEach((planet) => World.remove(world, planet));

            saveScoreToLeaderboard(score);

            score = 0;
            displayedScore = 0;
            updateScoreDisplay();

            clearInterval(shakeInterval);
            resetGameOver();
            cursor.classList.remove("noCursor");
            deleteUses = 0;
            updateDeleteButtonLabel();
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

window.addEventListener("load", updateLeaderboardDisplay);

// -------------------- FIREBASE LEADERBOARD----------------------
async function saveScoreToLeaderboard(score) {
    if (!isFirebaseInitialized) {
        console.log('Firebase not available, using local storage');
        saveScoreToLocalLeaderboard(score);
        return;
    }

    try {
        const name = prompt("Enter your name:", "Player") || "Player";

        const header = document.querySelector('#leaderboard-div h3');
        if (header) header.textContent = 'Submitting Score...';

        const scoreData = {
            name: name.substring(0, 8),
            score,
            largestPlanet: largestPlanetReached,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        // Pick correct leaderboard node based on mode
        const refName = currentGameMode === "arcade" ? "leaderboard_arcade" : "leaderboard_realistic";
        await database.ref(refName).push(scoreData);

        console.log(`Score submitted to ${refName}!`);

        setTimeout(() => updateLeaderboardDisplay(), 1000);

    } catch (error) {
        console.error('Error submitting score to Firebase:', error);
        alert('Failed to submit score to global leaderboard. Saving locally.');
        saveScoreToLocalLeaderboard(score);
    } finally {
        largestPlanetReached = 0;
    }
}

// Fallback to local storage
function saveScoreToLocalLeaderboard(score) {
    const key = currentGameMode === "arcade" ? "planetLeaderboard_arcade" : "planetLeaderboard_realistic";
    let leaderboard = JSON.parse(localStorage.getItem(key) || "[]");

    const name = prompt("Enter your name:", "Player") || "Player";

    leaderboard.push({
        name: name + " (Local)",
        score,
        largestPlanet: largestPlanetReached,
        timestamp: Date.now()
    });

    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 15);
    localStorage.setItem(key, JSON.stringify(leaderboard));
    displayLeaderboard(leaderboard, true);
    largestPlanetReached = 0;
}

async function updateLeaderboardDisplay() {
    if (!isFirebaseInitialized) {
        const key = currentGameMode === "arcade" ? "planetLeaderboard_arcade" : "planetLeaderboard_realistic";
        const localLeaderboard = JSON.parse(localStorage.getItem(key) || "[]");
        displayLeaderboard(localLeaderboard, true);
        return;
    }

    try {
        showLeaderboardLoading(`Loading ${currentGameMode === "arcade" ? "Arcade" : "Realistic"} leaderboard...`);

        const refName = currentGameMode === "arcade" ? "leaderboard_arcade" : "leaderboard_realistic";
        const snapshot = await database.ref(refName)
            .orderByChild('score')
            .limitToLast(100)
            .once('value');

        const data = snapshot.val();

        if (!data) {
            displayLeaderboard([]);
            return;
        }

        const leaderboard = Object.values(data)
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);

        displayLeaderboard(leaderboard);

    } catch (error) {
        console.error('Error fetching leaderboard from Firebase:', error);

        const key = currentGameMode === "arcade" ? "planetLeaderboard_arcade" : "planetLeaderboard_realistic";
        const localLeaderboard = JSON.parse(localStorage.getItem(key) || "[]");
        displayLeaderboard(localLeaderboard, true);
    }
}

function showLeaderboardLoading(message) {
    const list = document.getElementById("LB-list");
    const header = document.querySelector('#leaderboard-div h3');

    list.innerHTML = `<li style="text-align: center; color: #888; font-style: italic;">${message}</li>`;
    if (header) header.textContent = 'Loading...';
}

function displayLeaderboard(leaderboard, isLocal = false) {
    const list = document.getElementById("LB-list");
    const header = document.querySelector('#leaderboard-div h3');

    list.innerHTML = "";

    // Pick readable label for mode
    const modeLabel = currentGameMode === "arcade" ? "Arcade" : "Realistic";

    // Update header
    if (header) {
        header.textContent = (isLocal ? "Local " : "Global ") + " Leaderboard";
        header.style.color = isLocal ? '#ff6b6b' : 'aliceblue';
    }

    if (leaderboard.length === 0) {
        list.innerHTML = `
        <li style="
            text-align: center; 
            color: #888; 
            transition: text-shadow 0.2s ease;
        " 
        onmouseover="this.style.textShadow='2px 2px 4px rgba(170, 170, 170, 0.6)'" 
        onmouseout="this.style.textShadow='none'">
            No scores yet!
        </li>`;
        return;
    }

    // Ensure tooltip exists
    let tooltip = document.querySelector('.leaderboard-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'leaderboard-tooltip';
        document.body.appendChild(tooltip);
    }

    leaderboard.forEach((entry, idx) => {
        const li = document.createElement("li");

        const displayName = entry.name || 'Anonymous';
        li.textContent = `${idx + 1}. ${displayName} — ${entry.score.toLocaleString()} pts`;

        // Tooltip
        li.addEventListener('mouseenter', (e) => {
            const largestPlanetIndex = entry.largestPlanet || 0;
            const planetName = planetStages[largestPlanetIndex]?.name || 'Unknown';

            let dateStr = '';
            if (entry.timestamp) {
                const date = new Date(entry.timestamp);

                const pad = (num) => String(num).padStart(2, '0');

                const year = date.getFullYear();
                const month = pad(date.getMonth() + 1);
                const day = pad(date.getDate());
                const hours = pad(date.getHours());
                const minutes = pad(date.getMinutes());

                const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;

                dateStr = `<div style="font-size: 12px; color: #aaa; margin-top: 4px;">Date: ${formatted}</div>`;
            }

            tooltip.innerHTML = `
                <div>Largest Planet: <strong>${planetName}</strong></div>
                ${dateStr}
            `;

            tooltip.classList.add('show');

            // Position tooltip
            const rect = li.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let left = rect.right + 10;
            let top = rect.top + rect.height / 2 - tooltipRect.height / 2;

            if (left + tooltipRect.width > window.innerWidth) {
                left = rect.left - tooltipRect.width - 10;
            }
            if (top < 0) top = 10;
            if (top + tooltipRect.height > window.innerHeight) {
                top = window.innerHeight - tooltipRect.height - 10;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });

        li.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });

        li.addEventListener('mouseenter', () => {
            playSCSFX();
        });

        list.appendChild(li);
    });
}

// Auto-refresh every 30 seconds (only if Firebase is working)
setInterval(() => {
    if (isFirebaseInitialized) {
        updateLeaderboardDisplay();
    }
}, 30000);

// Initialize when page loads
window.addEventListener("load", () => {
    setTimeout(() => {
        updateLeaderboardDisplay();
    }, 2000); // Wait 2 seconds to ensure Firebase is loaded
});

// Function for testing/development only (clear leaderboard)
async function clearLeaderboard() {
    if (!isFirebaseInitialized) {
        console.log('Firebase not initialized');
        return;
    }

    try {
        const refName = currentGameMode === "arcade"
            ? "leaderboard_arcade"
            : "leaderboard_realistic";

        await database.ref(refName).remove();
        console.log(`${refName} cleared successfully`);
        updateLeaderboardDisplay();
    } catch (error) {
        console.error('Error clearing leaderboard:', error);
    }
}

/* Full Screen--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const elementsConfig = {
        "body-div": { default: "30px", fullscreen: "90px" },
        "preview-container": { default: "30px", fullscreen: "90px" },
        "leaderboard-div": { default: "425px", fullscreen: "530px" },
        "score-div": { default: "350px", fullscreen: "440px" },
        "planet-size-box": { default: "20px", fullscreen: "90px" },
        "game-container": { default: "0px", fullscreen: "60px" }
    };

    const elements = {};
    Object.keys(elementsConfig).forEach(id => {
        const el = document.getElementById(id);
        if (el) elements[id] = el;
    });

    function isF11Fullscreen() {
        return window.innerHeight === screen.height || window.outerHeight === screen.height;
    }

    function adjustTop() {
        Object.entries(elementsConfig).forEach(([id, config]) => {
            const el = elements[id];
            if (!el) return;

            if (isF11Fullscreen()) {
                el.style.top = config.fullscreen;
            } else {
                el.style.top = config.default;
            }
        });
    }

    adjustTop();

    window.addEventListener("resize", adjustTop);
}); 