// =====================================================
// AFTERLIGHT
// PC + MOBILE + TABLET
// =====================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// =====================================================
// GET EXISTING HTML ELEMENTS
// =====================================================

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const startButton = document.getElementById("startButton");

const healthText = document.getElementById("health");
const ammoText = document.getElementById("ammo");
const coinsText = document.getElementById("coins");
const cluesText = document.getElementById("clues");

const objective = document.getElementById("objective");
const interaction = document.getElementById("interaction");

const houseInterior =
    document.getElementById("houseInterior");

const interiorNumber =
    document.getElementById("interiorNumber");

const interiorText =
    document.getElementById("interiorText");

const searchHouse =
    document.getElementById("searchHouse");

const leaveHouse =
    document.getElementById("leaveHouse");

const cluePanel =
    document.getElementById("cluePanel");

const clueTitle =
    document.getElementById("clueTitle");

const clueText =
    document.getElementById("clueText");

const closeClue =
    document.getElementById("closeClue");

const bossPanel =
    document.getElementById("bossPanel");

const enterBossFight =
    document.getElementById("enterBossFight");

const endingPanel =
    document.getElementById("endingPanel");

const endingTitle =
    document.getElementById("endingTitle");

const endingText =
    document.getElementById("endingText");

const restartButton =
    document.getElementById("restartButton");


// =====================================================
// WORLD
// =====================================================

const WORLD_W = 3200;
const WORLD_H = 2400;


// =====================================================
// PLAYER
// =====================================================

const player = {

    x: 400,
    y: 400,

    speed: 4,

    health: 100,
    ammo: 30,
    coins: 0,

    angle: 0
};


// =====================================================
// CAMERA
// =====================================================

const camera = {
    x: 0,
    y: 0
};


// =====================================================
// GAME STATE
// =====================================================

let houses = [];
let enemies = [];
let bullets = [];

let clues = 0;

let currentHouse = null;

let started = false;
let inHouse = false;
let bossFight = false;
let bossDefeated = false;
let finished = false;


// =====================================================
// INPUT
// =====================================================

const keys = {};

const mouse = {

    x: 0,
    y: 0,
    down: false
};


// =====================================================
// MOBILE STATE
// =====================================================

let mobileMoveX = 0;
let mobileMoveY = 0;

let mobileAimX = 0;
let mobileAimY = 0;

let mobileShooting = false;

let movePointer = null;
let aimPointer = null;


// =====================================================
// BOSS
// =====================================================

const boss = {

    x: WORLD_W - 300,
    y: WORLD_H - 300,

    health: 40,
    maxHealth: 40,

    active: false
};


// =====================================================
// CANVAS RESIZE
// =====================================================

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        Math.floor(
            window.innerWidth * dpr
        );

    canvas.height =
        Math.floor(
            window.innerHeight * dpr
        );

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    updateCamera();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


// =====================================================
// CLUES
// =====================================================

const clueList = [

    "A note says: THEY TOOK HIM IN A BLACK CAR.",

    "A photograph shows Eli's brother with three strangers.",

    "A receipt mentions the old warehouse.",

    "Someone wrote: THE MEN WERE WEARING BLACK SUITS.",

    "A phone number is written on a piece of paper.",

    "A map points toward the east side.",

    "A newspaper has the mafia symbol circled.",

    "A note says: KEEP LOOKING.",

    "A witness saw three men near the road.",

    "A broken phone contains a strange location.",

    "The location points toward the industrial district.",

    "A note says: DO NOT TRUST THE DRIVER.",

    "A business card belongs to someone named Victor.",

    "Victor is connected to the mafia.",

    "A warehouse number is written on the wall.",

    "Someone says the factory is still active.",

    "A security report mentions mafia guards.",

    "A photograph shows an old factory.",

    "A note says: HE WAS MOVED.",

    "Another note says: HE IS STILL ALIVE.",

    "A map shows a hidden factory entrance.",

    "Someone wrote: THE BOSS KNOWS WHERE HE IS.",

    "A guard badge has the factory symbol.",

    "A document mentions a prisoner.",

    "The prisoner description matches Eli's brother.",

    "The factory location appears again.",

    "A final route points to the industrial district.",

    "The mafia has been using the factory.",

    "The last note says: FIND THE BOSS.",

    "THE FINAL CLUE: YOUR BROTHER IS INSIDE THE FACTORY."

];


// =====================================================
// MOBILE CONTROLS
// Creates them automatically.
// =====================================================

let mobileControls;
let joystick;
let joystickStick;

let aimJoystick;
let aimStick;

let shootButton;
let interactButton;
let reloadButton;


function createMobileControls() {

    if (
        document.getElementById(
            "afterlightMobileControls"
        )
    ) {

        setupMobileReferences();

        return;
    }


    mobileControls =
        document.createElement("div");

    mobileControls.id =
        "afterlightMobileControls";


    mobileControls.innerHTML = `

        <div id="afterlightMoveStick"
             class="afterlightJoystick">

            <div class="afterlightJoystickText">
                MOVE
            </div>

            <div id="afterlightMoveKnob"
                 class="afterlightStick">
            </div>

        </div>


        <div id="afterlightAimStick"
             class="afterlightJoystick afterlightAim">

            <div class="afterlightJoystickText">
                AIM
            </div>

            <div id="afterlightAimKnob"
                 class="afterlightStick">
            </div>

        </div>


        <button id="afterlightShoot"
                class="afterlightMobileButton afterlightShoot">

            🔫

        </button>


        <button id="afterlightInteract"
                class="afterlightMobileButton afterlightInteract">

            E

        </button>


        <button id="afterlightReload"
                class="afterlightMobileButton afterlightReload">

            R

        </button>
    `;


    document.body.appendChild(
        mobileControls
    );


    const style =
        document.createElement("style");


    style.textContent = `

        #afterlightMobileControls {

            position: fixed;
            inset: 0;

            z-index: 9999;

            pointer-events: none;

            display: none;

            touch-action: none;

            user-select: none;

            -webkit-user-select: none;
        }


        @media
        (pointer: coarse),
        (hover: none) {

            #afterlightMobileControls {

                display: block;
            }
        }


        .afterlightJoystick {

            position: absolute;

            left: 18px;
            bottom: 22px;

            width: 125px;
            height: 125px;

            border-radius: 50%;

            background:
                rgba(0,0,0,.35);

            border:
                3px solid
                rgba(255,255,255,.45);

            pointer-events: auto;

            touch-action: none;

            box-sizing: border-box;
        }


        .afterlightAim {

            left: auto;
            right: 18px;
            bottom: 145px;
        }


        .afterlightStick {

            position: absolute;

            left: 50%;
            top: 50%;

            width: 55px;
            height: 55px;

            margin-left: -27.5px;
            margin-top: -27.5px;

            border-radius: 50%;

            background:
                rgba(228,189,87,.9);

            border:
                3px solid white;

            pointer-events: none;
        }


        .afterlightJoystickText {

            position: absolute;

            left: 50%;
            top: 50%;

            transform:
                translate(-50%,-50%);

            color:
                rgba(255,255,255,.45);

            font-size: 11px;

            font-weight: bold;

            pointer-events: none;
        }


        .afterlightMobileButton {

            position: absolute;

            border: 3px solid
                rgba(255,255,255,.7);

            border-radius: 50%;

            pointer-events: auto;

            touch-action: none;

            font-weight: 900;

            color: white;

            box-shadow:
                0 5px 12px
                rgba(0,0,0,.35);
        }


        .afterlightShoot {

            right: 20px;
            bottom: 20px;

            width: 95px;
            height: 95px;

            background:
                rgba(170,40,30,.88);

            font-size: 35px;
        }


        .afterlightInteract {

            right: 130px;
            bottom: 25px;

            width: 65px;
            height: 65px;

            background:
                rgba(228,189,87,.95);

            color: #111;

            font-size: 22px;
        }


        .afterlightReload {

            right: 140px;
            bottom: 105px;

            width: 50px;
            height: 50px;

            background:
                rgba(30,30,30,.9);

            font-size: 17px;
        }


        @media (max-width: 500px) {

            .afterlightJoystick {

                width: 105px;
                height: 105px;

                left: 10px;
                bottom: 12px;
            }


            .afterlightAim {

                right: 10px;
                bottom: 130px;
            }


            .afterlightStick {

                width: 47px;
                height: 47px;

                margin-left: -23.5px;
                margin-top: -23.5px;
            }


            .afterlightShoot {

                width: 82px;
                height: 82px;

                right: 12px;
                bottom: 10px;
            }


            .afterlightInteract {

                right: 105px;
                bottom: 18px;

                width: 55px;
                height: 55px;
            }


            .afterlightReload {

                right: 115px;
                bottom: 82px;

                width: 45px;
                height: 45px;
            }
        }
    `;


    document.head.appendChild(style);

    setupMobileReferences();
}


function setupMobileReferences() {

    joystick =
        document.getElementById(
            "afterlightMoveStick"
        );

    joystickStick =
        document.getElementById(
            "afterlightMoveKnob"
        );

    aimJoystick =
        document.getElementById(
            "afterlightAimStick"
        );

    aimStick =
        document.getElementById(
            "afterlightAimKnob"
        );

    shootButton =
        document.getElementById(
            "afterlightShoot"
        );

    interactButton =
        document.getElementById(
            "afterlightInteract"
        );

    reloadButton =
        document.getElementById(
            "afterlightReload"
        );


    setupJoystick(
        joystick,
        joystickStick,
        "move"
    );


    setupJoystick(
        aimJoystick,
        aimStick,
        "aim"
    );


    setupShootButton();

    setupMobileButtons();
}


// =====================================================
// JOYSTICKS
// =====================================================

function setupJoystick(
    stickArea,
    knob,
    type
) {

    if (!stickArea) return;


    function moveJoystick(
        clientX,
        clientY
    ) {

        const rect =
            stickArea.getBoundingClientRect();

        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;

        let dx =
            clientX - centerX;

        let dy =
            clientY - centerY;

        const max =
            rect.width / 2 - 32;

        const distance =
            Math.hypot(dx, dy);


        if (distance > max) {

            dx =
                dx / distance * max;

            dy =
                dy / distance * max;
        }


        knob.style.transform =
            `translate(${dx}px,${dy}px)`;


        if (type === "move") {

            mobileMoveX =
                dx / max;

            mobileMoveY =
                dy / max;
        }


        if (type === "aim") {

            mobileAimX =
                dx / max;

            mobileAimY =
                dy / max;
        }
    }


    function reset() {

        knob.style.transform =
            "translate(0px,0px)";


        if (type === "move") {

            mobileMoveX = 0;
            mobileMoveY = 0;

            movePointer = null;
        }


        if (type === "aim") {

            mobileAimX = 0;
            mobileAimY = 0;

            aimPointer = null;
        }
    }


    stickArea.addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            if (type === "move") {

                movePointer =
                    e.pointerId;
            }

            if (type === "aim") {

                aimPointer =
                    e.pointerId;
            }

            stickArea.setPointerCapture(
                e.pointerId
            );

            moveJoystick(
                e.clientX,
                e.clientY
            );
        }
    );


    stickArea.addEventListener(
        "pointermove",
        e => {

            if (
                type === "move" &&
                e.pointerId !== movePointer
            ) return;

            if (
                type === "aim" &&
                e.pointerId !== aimPointer
            ) return;

            moveJoystick(
                e.clientX,
                e.clientY
            );
        }
    );


    stickArea.addEventListener(
        "pointerup",
        reset
    );

    stickArea.addEventListener(
        "pointercancel",
        reset
    );
}


// =====================================================
// MOBILE SHOOT
// =====================================================

function setupShootButton() {

    if (!shootButton) return;


    shootButton.addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            mobileShooting = true;

            shoot();
        }
    );


    shootButton.addEventListener(
        "pointerup",
        e => {

            e.preventDefault();

            mobileShooting = false;
        }
    );


    shootButton.addEventListener(
        "pointercancel",
        () => {

            mobileShooting = false;
        }
    );


    shootButton.addEventListener(
        "pointerleave",
        () => {

            mobileShooting = false;
        }
    );
}


// =====================================================
// MOBILE BUTTONS
// =====================================================

function setupMobileButtons() {

    if (interactButton) {

        interactButton.addEventListener(
            "pointerdown",
            e => {

                e.preventDefault();

                interact();
            }
        );
    }


    if (reloadButton) {

        reloadButton.addEventListener(
            "pointerdown",
            e => {

                e.preventDefault();

                reload();
            }
        );
    }
}


// =====================================================
// START GAME
// =====================================================

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );
}


function startGame() {

    console.log(
        "AFTERLIGHT STARTED"
    );


    started = true;

    finished = false;

    inHouse = false;

    bossFight = false;

    bossDefeated = false;


    player.x = 400;
    player.y = 400;

    player.health = 100;
    player.ammo = 30;
    player.coins = 0;

    clues = 0;


    createWorld();


    boss.health =
        boss.maxHealth;

    boss.active = false;


    if (startScreen) {

        startScreen.style.display =
            "none";
    }


    if (game) {

        game.style.display =
            "block";
    }


    updateHUD();

    updateObjective();

    updateMobileButtons();
}


// =====================================================
// CREATE WORLD
// =====================================================

function createWorld() {

    houses = [];
    enemies = [];
    bullets = [];


    let number = 1;


    for (
        let row = 0;
        row < 5;
        row++
    ) {

        for (
            let col = 0;
            col < 6;
            col++
        ) {

            houses.push({

                x:
                    250 +
                    col * 480,

                y:
                    250 +
                    row * 400,

                width: 220,

                height: 170,

                number: number,

                searched: false
            });


            number++;
        }
    }


    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const house =
            houses[i];


        enemies.push({

            x:
                house.x + 290,

            y:
                house.y + 80,

            health: 3,

            maxHealth: 3,

            speed: 1.1,

            angle: 0,

            hitCooldown: 0
        });
    }
}


// =====================================================
// KEYBOARD
// =====================================================

window.addEventListener(
    "keydown",
    e => {

        keys[
            e.key.toLowerCase()
        ] = true;


        if (
            e.key.toLowerCase() === "e"
        ) {

            interact();
        }


        if (
            e.key.toLowerCase() === "r"
        ) {

            reload();
        }
    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[
            e.key.toLowerCase()
        ] = false;
    }
);


// =====================================================
// MOUSE
// =====================================================

canvas.addEventListener(
    "mousemove",
    e => {

        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
);


canvas.addEventListener(
    "mousedown",
    e => {

        if (e.button === 0) {

            mouse.down = true;
        }
    }
);


window.addEventListener(
    "mouseup",
    e => {

        if (e.button === 0) {

            mouse.down = false;
        }
    }
);


// =====================================================
// RELOAD
// =====================================================

function reload() {

    if (!started) return;

    if (finished) return;

    player.ammo = 30;

    updateHUD();
}


// =====================================================
// INTERACT
// =====================================================

function interact() {

    if (!started) return;

    if (finished) return;

    if (inHouse) return;

    if (bossFight) return;


    if (clues >= 30) {

        const distance =
            Math.hypot(
                player.x - boss.x,
                player.y - boss.y
            );


        if (distance < 230) {

            bossPanel.style.display =
                "flex";

            return;
        }
    }


    enterHouse();
}


// =====================================================
// FIND NEAREST HOUSE
// =====================================================

function getNearestHouse() {

    let closest = null;

    let closestDistance =
        Infinity;


    for (const house of houses) {

        const cx =
            house.x +
            house.width / 2;

        const cy =
            house.y +
            house.height / 2;


        const distance =
            Math.hypot(
                player.x - cx,
                player.y - cy
            );


        if (
            distance <
            closestDistance
        ) {

            closestDistance =
                distance;

            closest =
                house;
        }
    }


    return {

        house: closest,

        distance:
            closestDistance
    };
}


// =====================================================
// ENTER HOUSE
// =====================================================

function enterHouse() {

    if (inHouse) return;


    const result =
        getNearestHouse();


    if (!result.house) return;


    if (
        result.distance <= 220
    ) {

        currentHouse =
            result.house;

        inHouse = true;


        houseInterior.style.display =
            "flex";


        interiorNumber.textContent =
            "HOUSE #" +
            currentHouse.number;


        if (
            currentHouse.searched
        ) {

            interiorText.textContent =
                "You already searched this house.";

            searchHouse.style.display =
                "none";

        } else {

            interiorText.textContent =
                "Search the room. There could be a clue about your brother.";

            searchHouse.style.display =
                "inline-block";
        }
    }
}


// =====================================================
// SEARCH HOUSE
// =====================================================

searchHouse.addEventListener(
    "click",
    searchCurrentHouse
);


function searchCurrentHouse() {

    if (!currentHouse) return;

    if (currentHouse.searched) return;


    currentHouse.searched =
        true;


    clues++;


    const foundCoins =
        10 +
        Math.floor(
            Math.random() * 30
        );


    const foundAmmo =
        3 +
        Math.floor(
            Math.random() * 8
        );


    player.coins +=
        foundCoins;


    player.ammo =
        Math.min(
            30,

            player.ammo +
            foundAmmo
        );


    interiorText.textContent =
        `LOOT FOUND: ${foundCoins} COINS + ${foundAmmo} AMMO`;


    searchHouse.style.display =
        "none";


    updateHUD();


    setTimeout(
        () => {

            cluePanel.style.display =
                "flex";


            clueTitle.textContent =
                "CLUE " +
                clues +
                "/30";


            clueText.textContent =
                clueList[
                    clues - 1
                ];
        },

        350
    );
}


// =====================================================
// LEAVE HOUSE
// =====================================================

leaveHouse.addEventListener(
    "click",
    leaveCurrentHouse
);


function leaveCurrentHouse() {

    houseInterior.style.display =
        "none";

    inHouse = false;

    currentHouse = null;

    updateObjective();
}


// =====================================================
// CLOSE CLUE
// =====================================================

closeClue.addEventListener(
    "click",
    () => {

        cluePanel.style.display =
            "none";

        updateObjective();
    }
);


// =====================================================
// OBJECTIVE
// =====================================================

function updateObjective() {

    if (clues >= 30) {

        objective.textContent =
            "THE FACTORY IS SOUTH-EAST. FIND YOUR BROTHER.";

    } else {

        objective.textContent =
            "SEARCH THE HOUSES — " +
            clues +
            "/30 CLUES FOUND.";
    }
}


// =====================================================
// PLAYER UPDATE
// =====================================================

function updatePlayer() {

    if (!started) return;

    if (inHouse) return;

    if (finished) return;


    let dx = 0;
    let dy = 0;


    // PC

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy--;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy++;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx--;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx++;
    }


    // MOBILE

    dx += mobileMoveX;
    dy += mobileMoveY;


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.hypot(
                dx,
                dy
            );


        dx /= length;
        dy /= length;


        player.x +=
            dx *
            player.speed;


        player.y +=
            dy *
            player.speed;
    }


    player.x =
        Math.max(
            25,

            Math.min(
                WORLD_W - 25,
                player.x
            )
        );


    player.y =
        Math.max(
            25,

            Math.min(
                WORLD_H - 25,
                player.y
            )
        );


    // MOBILE AIM

    if (
        Math.abs(mobileAimX) > 0.1 ||
        Math.abs(mobileAimY) > 0.1
    ) {

        player.angle =
            Math.atan2(
                mobileAimY,
                mobileAimX
            );

    } else {

        // PC AIM

        const worldMouseX =
            mouse.x +
            camera.x;


        const worldMouseY =
            mouse.y +
            camera.y;


        player.angle =
            Math.atan2(
                worldMouseY -
                player.y,

                worldMouseX -
                player.x
            );
    }
}


// =====================================================
// SHOOTING
// =====================================================

let shootTimer = 0;


function shoot() {

    if (!started) return;

    if (inHouse) return;

    if (finished) return;

    if (shootTimer > 0) return;

    if (player.ammo <= 0) return;


    player.ammo--;

    shootTimer = 9;


    bullets.push({

        x:
            player.x +
            Math.cos(
                player.angle
            ) * 35,

        y:
            player.y +
            Math.sin(
                player.angle
            ) * 35,

        vx:
            Math.cos(
                player.angle
            ) * 13,

        vy:
            Math.sin(
                player.angle
            ) * 13,

        life: 70
    });


    updateHUD();
}


function updateShooting() {

    if (shootTimer > 0) {

        shootTimer--;
    }


    if (
        mouse.down ||
        mobileShooting
    ) {

        shoot();
    }
}


// =====================================================
// ENEMIES
// =====================================================

function updateEnemies() {

    if (inHouse) return;

    if (finished) return;


    for (
        const enemy of enemies
    ) {

        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance < 550 &&
            distance > 55
        ) {

            enemy.angle =
                Math.atan2(
                    dy,
                    dx
                );


            enemy.x +=
                dx /
                distance *
                enemy.speed;


            enemy.y +=
                dy /
                distance *
                enemy.speed;
        }


        if (
            distance < 55 &&
            enemy.hitCooldown <= 0
        ) {

            player.health -= 5;

            enemy.hitCooldown =
                50;

            updateHUD();


            if (
                player.health <= 0
            ) {

                endGame(
                    "ELI WAS CAUGHT",

                    "The mafia stopped Eli before he could rescue his brother."
                );
            }
        }


        if (
            enemy.hitCooldown > 0
        ) {

            enemy.hitCooldown--;
        }
    }
}


// =====================================================
// BULLETS
// =====================================================

function updateBullets() {

    for (
        let i =
        bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.vx;

        bullet.y +=
            bullet.vy;

        bullet.life--;


        let remove = false;


        // ENEMIES

        for (
            let j =
            enemies.length - 1;

            j >= 0;

            j--
        ) {

            const enemy =
                enemies[j];


            if (
                Math.hypot(
                    bullet.x -
                    enemy.x,

                    bullet.y -
                    enemy.y
                ) < 30
            ) {

                enemy.health--;

                remove = true;


                if (
                    enemy.health <= 0
                ) {

                    enemies.splice(
                        j,
                        1
                    );


                    player.coins +=
                        20;


                    updateHUD();
                }


                break;
            }
        }


        // BOSS

        if (
            !remove &&
            hitBoss(bullet)
        ) {

            remove = true;
        }


        if (
            remove ||

            bullet.life <= 0 ||

            bullet.x < 0 ||

            bullet.y < 0 ||

            bullet.x > WORLD_W ||

            bullet.y > WORLD_H
        ) {

            bullets.splice(
                i,
                1
            );
        }
    }
}


// =====================================================
// BOSS
// =====================================================

enterBossFight.addEventListener(
    "click",
    () => {

        bossPanel.style.display =
            "none";

        bossFight = true;

        boss.active = true;

        objective.textContent =
            "DEFEAT THE MAFIA BOSS. YOUR BROTHER IS INSIDE.";
    }
);


function updateBoss() {

    if (!bossFight) return;

    if (bossDefeated) return;

    if (finished) return;


    const dx =
        player.x -
        boss.x;

    const dy =
        player.y -
        boss.y;


    const distance =
        Math.hypot(
            dx,
            dy
        );


    if (
        distance > 65
    ) {

        boss.x +=
            dx /
            distance *
            0.8;

        boss.y +=
            dy /
            distance *
            0.8;
    }


    if (
        distance < 65
    ) {

        player.health -=
            0.1;

        updateHUD();


        if (
            player.health <= 0
        ) {

            endGame(
                "MISSION FAILED",

                "Eli could not reach his brother."
            );
        }
    }
}


function hitBoss(bullet) {

    if (!bossFight)
        return false;

    if (bossDefeated)
        return false;


    const distance =
        Math.hypot(
            bullet.x -
            boss.x,

            bullet.y -
            boss.y
        );


    if (
        distance < 65
    ) {

        boss.health--;


        if (
            boss.health <= 0
        ) {

            bossDefeated =
                true;

            bossFight =
                false;

            boss.active =
                false;


            endGame(

                "BROTHER FOUND",

                "Eli defeated the mafia boss and found his brother alive inside the factory. After three years, they are finally together again."
            );
        }


        return true;
    }


    return false;
}


// =====================================================
// FACTORY
// =====================================================

function updateFactory() {

    if (clues < 30)
        return;

    if (bossDefeated)
        return;

    if (finished)
        return;


    const distance =
        Math.hypot(
            player.x -
            boss.x,

            player.y -
            boss.y
        );


    if (
        distance < 230
    ) {

        interaction.style.display =
            "block";

        interaction.textContent =
            "E — ENTER FACTORY";

    }
}


// =====================================================
// INTERACTION UI
// =====================================================

function updateInteraction() {

    if (!started) {

        interaction.style.display =
            "none";

        return;
    }


    if (inHouse) {

        interaction.style.display =
            "none";

        return;
    }


    if (finished) {

        interaction.style.display =
            "none";

        return;
    }


    if (clues >= 30) {

        const distance =
            Math.hypot(
                player.x -
                boss.x,

                player.y -
                boss.y
            );


        if (
            distance < 230
        ) {

            interaction.style.display =
                "block";

            interaction.textContent =
                "E — ENTER FACTORY";

            return;
        }
    }


    const result =
        getNearestHouse();


    if (
        result.house &&
        result.distance <= 220
    ) {

        interaction.style.display =
            "block";

        interaction.textContent =
            "E — ENTER HOUSE";

        return;
    }


    interaction.style.display =
        "none";
}


// =====================================================
// MOBILE BUTTON STATE
// =====================================================

function updateMobileButtons() {

    if (!interactButton)
        return;


    if (!started) {

        interactButton.style.display =
            "none";

        return;
    }


    if (inHouse) {

        interactButton.textContent =
            "×";

        return;
    }


    interactButton.style.display =
        "block";

    interactButton.textContent =
        "E";
}


// =====================================================
// CAMERA
// =====================================================

function updateCamera() {

    const screenW =
        window.innerWidth;

    const screenH =
        window.innerHeight;


    camera.x =
        player.x -
        screenW / 2;


    camera.y =
        player.y -
        screenH / 2;


    camera.x =
        Math.max(
            0,

            Math.min(
                WORLD_W -
                screenW,

                camera.x
            )
        );


    camera.y =
        Math.max(
            0,

            Math.min(
                WORLD_H -
                screenH,

                camera.y
            )
        );
}


// =====================================================
// DRAW WORLD
// =====================================================

function drawWorld() {

    const screenW =
        window.innerWidth;

    const screenH =
        window.innerHeight;


    ctx.fillStyle =
        "#72ad61";


    ctx.fillRect(
        0,
        0,
        screenW,
        screenH
    );


    ctx.save();


    ctx.translate(
        -camera.x,
        -camera.y
    );


    drawGrass();

    drawRoads();

    drawHouses();


    if (clues >= 30) {

        drawFactory();
    }


    for (
        const enemy of enemies
    ) {

        drawEnemy(enemy);
    }


    if (
        bossFight &&
        !bossDefeated
    ) {

        drawBoss();
    }


    drawBullets();

    drawPlayer();


    ctx.restore();
}


// =====================================================
// GRASS
// =====================================================

function drawGrass() {

    ctx.fillStyle =
        "#659e57";


    for (
        let x = 0;
        x < WORLD_W;
        x += 70
    ) {

        for (
            let y = 0;
            y < WORLD_H;
            y += 70
        ) {

            ctx.fillRect(
                x + 12,
                y + 15,
                3,
                9
            );


            ctx.fillRect(
                x + 35,
                y + 35,
                3,
                6
            );
        }
    }
}


// =====================================================
// ROADS
// =====================================================

function drawRoads() {

    ctx.fillStyle =
        "#656565";


    for (
        let x = 100;
        x < WORLD_W;
        x += 480
    ) {

        ctx.fillRect(
            x,
            0,
            100,
            WORLD_H
        );
    }


    for (
        let y = 100;
        y < WORLD_H;
        y += 400
    ) {

        ctx.fillRect(
            0,
            y,
            WORLD_W,
            100
        );
    }


    ctx.fillStyle =
        "#e7d65e";


    for (
        let x = 145;
        x < WORLD_W;
        x += 480
    ) {

        for (
            let y = 0;
            y < WORLD_H;
            y += 75
        ) {

            ctx.fillRect(
                x,
                y,
                8,
                40
            );
        }
    }


    for (
        let y = 145;
        y < WORLD_H;
        y += 400
    ) {

        for (
            let x = 0;
            x < WORLD_W;
            x += 75
        ) {

            ctx.fillRect(
                x,
                y,
                40,
                8
            );
        }
    }
}


// =====================================================
// HOUSES
// =====================================================

function drawHouses() {

    for (
        const house of houses
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,.25)";


        ctx.fillRect(
            house.x + 12,
            house.y + 15,
            house.width,
            house.height
        );


        ctx.fillStyle =
            "#c69b68";


        ctx.fillRect(
            house.x,
            house.y + 35,
            house.width,
            house.height - 35
        );


        ctx.fillStyle =
            "#75483b";


        ctx.beginPath();


        ctx.moveTo(
            house.x - 20,
            house.y + 40
        );


        ctx.lineTo(
            house.x +
            house.width / 2,

            house.y - 45
        );


        ctx.lineTo(
            house.x +
            house.width +
            20,

            house.y + 40
        );


        ctx.closePath();

        ctx.fill();


        ctx.fillStyle =
            "#9a6251";


        ctx.fillRect(
            house.x + 20,
            house.y + 10,
            house.width - 40,
            10
        );


        drawWindow(
            house.x + 25,
            house.y + 70
        );


        drawWindow(
            house.x + 150,
            house.y + 70
        );


        ctx.fillStyle =
            "#4c3023";


        ctx.fillRect(
            house.x + 90,
            house.y + 85,
            45,
            85
        );


        ctx.fillStyle =
            "#e2c54d";


        ctx.fillRect(
            house.x + 125,
            house.y + 125,
            6,
            6
        );


        ctx.fillStyle =
            "#fff";


        ctx.font =
            "bold 15px Arial";


        ctx.fillText(
            "#" +
            house.number,

            house.x + 103,
            house.y + 62
        );
    }
}


function drawWindow(
    x,
    y
) {

    ctx.fillStyle =
        "#273e4a";


    ctx.fillRect(
        x,
        y,
        45,
        38
    );


    ctx.fillStyle =
        "#9bd4e4";


    ctx.fillRect(
        x + 4,
        y + 4,
        37,
        30
    );


    ctx.fillStyle =
        "#fff";


    ctx.fillRect(
        x + 20,
        y + 4,
        4,
        30
    );


    ctx.fillRect(
        x + 4,
        y + 17,
        37,
        4
    );
}


// =====================================================
// PLAYER
// =====================================================

function drawPlayer() {

    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    ctx.fillStyle =
        "rgba(0,0,0,.3)";


    ctx.beginPath();


    ctx.ellipse(
        0,
        25,
        25,
        8,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.fillStyle =
        "#202b36";


    ctx.fillRect(
        -13,
        12,
        10,
        27
    );


    ctx.fillRect(
        4,
        12,
        10,
        27
    );


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        -16,
        36,
        15,
        7
    );


    ctx.fillRect(
        3,
        36,
        16,
        7
    );


    ctx.fillStyle =
        "#294762";


    ctx.fillRect(
        -17,
        -14,
        34,
        31
    );


    ctx.fillStyle =
        "#3c607d";


    ctx.fillRect(
        -4,
        -12,
        8,
        27
    );


    ctx.fillStyle =
        "#17202a";


    ctx.fillRect(
        -23,
        -9,
        7,
        27
    );


    ctx.fillStyle =
        "#d69a6c";


    ctx.fillRect(
        -7,
        -22,
        14,
        10
    );


    ctx.fillStyle =
        "#dba073";


    ctx.fillRect(
        -14,
        -38,
        28,
        24
    );


    ctx.fillStyle =
        "#211b19";


    ctx.fillRect(
        -15,
        -43,
        30,
        12
    );


    ctx.fillRect(
        -11,
        -47,
        22,
        8
    );


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        -9,
        -30,
        4,
        4
    );


    ctx.fillRect(
        5,
        -30,
        4,
        4
    );


    ctx.save();


    ctx.rotate(
        player.angle
    );


    ctx.fillStyle =
        "#dba073";


    ctx.fillRect(
        5,
        -5,
        25,
        8
    );


    ctx.fillStyle =
        "#151719";


    ctx.fillRect(
        25,
        -5,
        30,
        8
    );


    ctx.restore();


    ctx.restore();
}


// =====================================================
// ENEMY
// =====================================================

function drawEnemy(enemy) {

    ctx.save();


    ctx.translate(
        enemy.x,
        enemy.y
    );


    ctx.fillStyle =
        "rgba(0,0,0,.35)";


    ctx.beginPath();


    ctx.ellipse(
        0,
        32,
        27,
        9,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.fillStyle =
        "#17191d";


    ctx.fillRect(
        -15,
        13,
        11,
        28
    );


    ctx.fillRect(
        4,
        13,
        11,
        28
    );


    ctx.fillStyle =
        "#090909";


    ctx.fillRect(
        -19,
        38,
        17,
        8
    );


    ctx.fillRect(
        3,
        38,
        18,
        8
    );


    ctx.fillStyle =
        "#181c22";


    ctx.fillRect(
        -20,
        -16,
        40,
        34
    );


    ctx.fillStyle =
        "#2a3038";


    ctx.fillRect(
        -16,
        -11,
        10,
        25
    );


    ctx.fillRect(
        6,
        -11,
        10,
        25
    );


    ctx.fillStyle =
        "#eeeeee";


    ctx.fillRect(
        -8,
        -14,
        16,
        22
    );


    ctx.fillStyle =
        "#9c252b";


    ctx.fillRect(
        -3,
        -12,
        6,
        23
    );


    ctx.fillStyle =
        "#c98c67";


    ctx.fillRect(
        -8,
        -25,
        16,
        11
    );


    ctx.fillRect(
        -15,
        -45,
        30,
        26
    );


    ctx.fillStyle =
        "#161414";


    ctx.fillRect(
        -16,
        -49,
        32,
        12
    );


    ctx.fillRect(
        -11,
        -53,
        22,
        8
    );


    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        -10,
        -36,
        7,
        3
    );


    ctx.fillRect(
        3,
        -36,
        7,
        3
    );


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        -22,
        -64,
        44,
        6
    );


    ctx.fillStyle =
        "#d93434";


    ctx.fillRect(
        -21,
        -63,
        42 *
        (
            enemy.health /
            enemy.maxHealth
        ),

        4
    );


    ctx.restore();
}


// =====================================================
// FACTORY
// =====================================================

function drawFactory() {

    const x =
        WORLD_W - 500;

    const y =
        WORLD_H - 500;


    ctx.fillStyle =
        "#27292d";


    ctx.fillRect(
        x,
        y,
        400,
        280
    );


    ctx.fillStyle =
        "#111318";


    ctx.fillRect(
        x - 20,
        y - 20,
        440,
        35
    );


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        ctx.fillStyle =
            "#e0bc48";


        ctx.fillRect(
            x + 35 +
            i * 60,

            y + 55,

            35,
            40
        );
    }


    ctx.fillStyle =
        "#080808";


    ctx.fillRect(
        x + 145,
        y + 145,
        110,
        135
    );


    ctx.fillStyle =
        "#d7b63f";


    ctx.font =
        "bold 25px Arial";


    ctx.fillText(
        "FACTORY",
        x + 145,
        y + 130
    );
}


// =====================================================
// BOSS DRAW
// =====================================================

function drawBoss() {

    if (!bossFight) return;

    if (bossDefeated) return;


    ctx.save();


    ctx.translate(
        boss.x,
        boss.y
    );


    ctx.fillStyle =
        "rgba(0,0,0,.4)";


    ctx.beginPath();


    ctx.ellipse(
        0,
        50,
        42,
        12,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        -18,
        20,
        14,
        38
    );


    ctx.fillRect(
        5,
        20,
        14,
        38
    );


    ctx.fillStyle =
        "#16181c";


    ctx.fillRect(
        -32,
        -25,
        64,
        58
    );


    ctx.fillStyle =
        "#ddd";


    ctx.fillRect(
        -10,
        -30,
        20,
        28
    );


    ctx.fillStyle =
        "#9c252b";


    ctx.fillRect(
        -4,
        -27,
        8,
        35
    );


    ctx.fillStyle =
        "#bd825f";


    ctx.fillRect(
        -21,
        -68,
        42,
        35
    );


    ctx.fillStyle =
        "#121212";


    ctx.fillRect(
        -23,
        -74,
        46,
        14
    );


    ctx.fillRect(
        -17,
        -80,
        34,
        10
    );


    ctx.fillStyle =
        "#050505";


    ctx.fillRect(
        -12,
        -53,
        6,
        5
    );


    ctx.fillRect(
        6,
        -53,
        6,
        5
    );


    ctx.fillStyle =
        "#16181c";


    ctx.fillRect(
        -43,
        -18,
        18,
        45
    );


    ctx.fillRect(
        25,
        -18,
        18,
        45
    );


    ctx.fillStyle =
        "#090909";


    ctx.fillRect(
        28,
        10,
        55,
        10
    );


    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        -60,
        -95,
        120,
        10
    );


    ctx.fillStyle =
        "#d83232";


    ctx.fillRect(
        -58,
        -93,
        116 *
        (
            boss.health /
            boss.maxHealth
        ),

        6
    );


    ctx.fillStyle =
        "#fff";


    ctx.font =
        "bold 14px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "MAFIA BOSS",
        0,
        -103
    );


    ctx.restore();
}


// =====================================================
// BULLETS
// =====================================================

function drawBullets() {

    for (
        const bullet of bullets
    ) {

        ctx.fillStyle =
            "#ffe16a";


        ctx.fillRect(
            bullet.x - 5,
            bullet.y - 2,
            10,
            4
        );
    }
}


// =====================================================
// HUD
// =====================================================

function updateHUD() {

    healthText.textContent =
        Math.max(
            0,
            Math.floor(
                player.health
            )
        );


    ammoText.textContent =
        player.ammo;


    coinsText.textContent =
        player.coins;


    cluesText.textContent =
        clues + "/30";
}


// =====================================================
// END GAME
// =====================================================

function endGame(
    title,
    text
) {

    if (finished)
        return;


    finished = true;


    endingTitle.textContent =
        title;


    endingText.textContent =
        text;


    endingPanel.style.display =
        "flex";


    mobileShooting =
        false;


    mobileMoveX = 0;
    mobileMoveY = 0;

    mobileAimX = 0;
    mobileAimY = 0;
}


// =====================================================
// RESTART
// =====================================================

restartButton.addEventListener(
    "click",
    () => {

        location.reload();
    }
);


// =====================================================
// INITIALIZE MOBILE CONTROLS
// =====================================================

createMobileControls();


// =====================================================
// NOW RESIZE CANVAS
// IMPORTANT: THIS IS AFTER PLAYER/CAMERA EXIST
// =====================================================

resizeCanvas();


// =====================================================
// MAIN GAME LOOP
// =====================================================

function gameLoop() {

    updatePlayer();

    updateShooting();

    updateEnemies();

    updateBullets();

    updateBoss();

    updateFactory();

    updateCamera();

    updateInteraction();

    drawWorld();


    requestAnimationFrame(
        gameLoop
    );
}


gameLoop();


console.log(
    "AFTERLIGHT MOBILE + TABLET BUILD LOADED"
);