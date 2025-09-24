# 🌌 Planet Merge
### *"Forge the Cosmos, One World at a Time"*

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Play_Now-Live_Demo-4CAF50?style=for-the-badge&logoColor=white)](https://planet-merge.netlify.app/)
[![Netlify Status](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://planet-merge.netlify.app/)

**An immersive physics-powered puzzle game where you merge celestial bodies to unlock the secrets of the universe**

[🎮 **Play Now**](https://planet-merge.netlify.app/) • [📖 **Documentation**](#project-structure) • [🛠️ **Tech Stack**](#tech-stack)

</div>

---

## 🎯 About

**Planet Merge** is a visually stunning space-themed puzzle game that combines realistic physics with cosmic progression. Start with humble asteroids and work your way up through planets, stars, and beyond to reach the ultimate goal—creating a black hole! Each merge brings you closer to mastering the cosmos.

## ✨ Key Features

🌟 **Animated Starfield** - Dynamic twinkling background creates an authentic space atmosphere  
⚡ **Physics Engine** - Realistic collisions and merges powered by [Matter.js](https://brm.io/matter-js/)  
🌍 **Progression System** - Evolve from asteroids → planets → stars → black holes  
🛸 **UFO Overlay** - Futuristic tractor beam guides your next strategic move  
🎮 **Dual Game Modes** - Switch between Arcade and Realistic physics modes  
🏆 **Global Leaderboard** - Compete worldwide with [Firebase](https://firebase.google.com/) integration that remembers your name  
🔍 **Zoom Controls** - Press `Ctrl + scroll wheel` to zoom in/out for optimal gameplay perspective  
👥 **Player Counter**: - Online player's number shown in realtime 

## 🚀 Quick Start

### Option 1: Play Online
Simply visit **[planet-merge.netlify.app](https://planet-merge.netlify.app/)** and start playing instantly!

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/planet-merge.git
cd planet-merge

# Open in your browser
open index.html
# or simply double-click index.html
```

## 🗂️ Project Structure

```
planet-merge/
├── 📄 index.html              # Main landing page
├── 📄 README.md               # Project documentation
├── 📁 css/
│   ├── 🎨 Fstyle.css         # Game styling
│   └── 🎨 index.css          # Landing page styling
├── 📁 html/
│   └── 🎮 Fgame.html         # Main game interface
├── 📁 img/
│   └── 🪐 icons8-planet-32.png # Game icon
└── 📁 js/
    └── ⚙️ Fscr.js            # Core game logic & physics
```

### 🔧 Core Components
- **Game Engine**: [`js/Fscr.js`](js/Fscr.js) - All game logic, physics, and interactions
- **UI Templates**: [`index.html`](index.html) & [`html/Fgame.html`](html/Fgame.html) - User interface
- **Styling**: [`css/Fstyle.css`](css/Fstyle.css) & [`css/index.css`](css/index.css) - Visual design
- **Assets**: [`img/icons8-planet-32.png`](img/icons8-planet-32.png) - Game graphics

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| **HTML5 Canvas** | 2D rendering and graphics |
| **Matter.js** | Realistic physics simulation |
| **CSS3 Animations** | Smooth UI transitions |
| **Vanilla JavaScript** | Game logic and interactions |
| **Firebase** | Real-time leaderboard database |
| **Netlify** | Deployment and hosting |

</div>

## 🎮 How to Play

1. **Drop Planets**: Click to drop celestial bodies into the play area
2. **Merge Strategy**: Combine identical objects to create larger ones
3. **Manage Space**: Use the UFO's tractor beam to guide placement
4. **Evolve**: Progress from asteroids → planets → stars → black holes
5. **Compete**: Submit your high scores to the global leaderboard

## 🗓️ Development Roadmap

### ✅ Completed
- [x] **Power-Up System**: DELETE button (deletes first 3 planets) unlocks at Solara
- [x] **Visual Polish**: Fixed planet selection indicators (now hot pink)
- [x] **Stackable Abilities**: Made delete ultimate stackable for strategic gameplay

### 🔄 In Progress
- [ ] **Balance Update**: Implement maximum delete uses limit (396)
- [ ] **Performance**: Optimize physics calculations for larger merges
- [ ] **Mobile Support**: Touch controls and responsive design

### 💭 Future Ideas
- **Visual Effects**: Particle systems for merges and special events
- **Achievements**: Unlock system for reaching specific milestones
- **Multiplayer**: Real-time competitive merging battles

## 🌟 Alternative Names Considered
*Planet Merge* • *Cosmic Fusion* • *Stellar Merge* • *Orbit Overlap* • *Celestial Merge* • *AstroMerge* • *Planetary Puzzle* • *Merge the Cosmos* • *Galactic Merge* • *Solar Synthesis* • *Nebula Merge* • *Gravity Merge* • *Planet Stackers* • *Stellar Stack* • *Astro Alchemy*

---

<div align="center">

> *"Merge, evolve, ascend. The universe awaits your mastery."*

**[🎮 Start Your Cosmic Journey](https://planet-merge.netlify.app/)**

</div>
