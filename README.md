# Rock-Paper-Scissors

[![Live on Netlify](https://img.shields.io/badge/Live_on-Netlify-brightgreen?style=for-the-badge&logo=netlify&logoColor=white)](https://rock-paper-scissors-pr0ject.netlify.app/)

A simple, animated **Rock-Paper-Scissors** game built with HTML, CSS, and JavaScript. Choose your move and see if you can beat the computer!

> 🎨 All hand gesture images used in the game were **created manually using Microsoft Paint** by me.

> 🌐 The game is also **deployed live on Netlify**:  

[https://rock-paper-scissors-pr0ject.netlify.app/](https://rock-paper-scissors-pr0ject.netlify.app/)

## 🎮 Features

- Choosable gamemode
- Clickable Rock / Paper / Scissors buttons
- Animated player and computer hand movements
- Live scoreboard display
- Game log showing Win / Lose / Draw results
- Reset button to restart the game and clear the log
- Favicon from [flaticon.com](https://www.flaticon.com/free-icon/rock_6587391?term=rock+paper+scissors&page=1&position=33&origin=tag&related_id=6587391)

## 📸 Preview

<details>
  <summary>Details</summary>
  
  <img width="1531" height="831" alt="image" src="https://github.com/user-attachments/assets/125ff45c-2e96-4345-8c16-48dd7d6246ab" />
</details>

## 🧑‍💻 Technologies

- **HTML5** – page structure
- **CSS3** – layout, animations, styling
- **JavaScript (vanilla)** – game logic and interactivity

<p>
  <img src="https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=ffffff" />
  <img src="https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=ffffff" />
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
</p>

## ✏️ Game Rules

- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock

## 🕹️ How to Play

1. Choose a gamemode (player vs player/player vs computer)
2. Click one of the Rock / Paper / Scissors buttons to make your choice.
3. Click the Play button to see the result.
4. The result and updated score will be displayed.
5. The log will record each round’s result.
6. Click the Reset button to clear the scores and logs.

## Future Features

-none-

<details> 
  <summary>📂 File Structure</summary>
  
```bash
.
└── Rock-Paper-Scissors/
    ├── index.html
    ├── sfx/
    │   ├── click.mp3
    │   ├── bg-music.mp3
    │   └── menu-bg-music.mp3
    │   └── RPSsound.mp3
    ├── js/
    │   ├── audioscr.js  
    │   ├── compscr.js  
    │   ├── fadeoverlayscr.js  
    │   ├── indexscr.js  
    │   └── multiscr.js  
    ├── html/
    │   ├── comp.html
    │   └── multi.html
    ├── css/
    │   ├── compscr.css  
    │   ├── fadeoverlayscr.css
    │   ├── indexscr.css
    │   └── multiscr.css 
    └── img/
        ├── cursor/
        │   ├── pixel.cur
        │   └── pixel_link.cur
        ├── icons/
        │   ├── check.png
        │   ├── exit.png
        │   ├── favicon.png
        │   ├── muteBtn.png
        │   └── speakerBtn.png
        ├── playervsx/
        │   ├── pvsc.png
        │   ├── pvsp.png
        │   └── no-bg-2/
        │       ├── pvsc-no-bg-2.png
        │       └── pvsp-no-bg-2.png
        ├── rock/
        │   ├── rock.png
        │   ├── rock-left.png
        │   ├── rock-right.png
        │   ├── no-bg/
        │   │   ├── rock-no-bg.png
        │   │   ├── rock-left-no-bg.png
        │   │   └── rock-right-no-bg.png
        │   └── no-bg-2/
        │       ├── rock-no-bg-2.png
        │       ├── rock-left-no-bg-2.png
        │       └── rock-right-no-bg-2.png
        ├── paper/
        │   ├── paper.png
        │   ├── paper-left.png
        │   ├── paper-right.png
        │   ├── no-bg/
        │   │   ├── paper-no-bg.png
        │   │   ├── paper-left-no-bg.png
        │   │   └── paper-right-no-bg.png
        │   └── no-bg-2/
        │       ├── paper-no-bg-2.png
        │       ├── paper-left-no-bg-2.png
        │       └── paper-right-no-bg-2.png
        └── scissors/
            ├── scissors.png
            ├── scissors-left.png
            ├── scissors-right.png
            ├── no-bg/
            │   ├── scissors-no-bg.png
            │   ├── scissors-left-no-bg.png
            │   └── scissors-right-no-bg.png
            └── no-bg-2/
                ├── scissors-no-bg-2.png
                ├── scissors-left-no-bg-2.png
                └── scissors-right-no-bg-2.png
  ```
</details>
