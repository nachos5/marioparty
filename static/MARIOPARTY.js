// ===========
// MARIO PARTY
// ===========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    processDiagnostics();
    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
// New Boolean
let g_useGrid = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

// New Keys
let KEY_GRID = keyCode('F');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    // Grid
    if (eatKey(KEY_GRID)) g_useGrid = !g_useGrid;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    mapManager.render(ctx);
    stateManager.render(ctx);
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads_images() {

    var requiredImages = {
        ship            : "static/assets/boardgamePack_v2/PNG/Pieces (Purple)/piecePurple_border15.png",

        // Background
        background1     : "static/assets/Mario-Background.jpg",
        brickBlock      : "static/assets/Brick_Block.png",
        backGreenPipe   : "static/assets/NSMBU-Green_Pipe.png",
        backBluePipe    : "static/assets/NSMBU-Blue_Pipe.png",
        backRedPipe     : "static/assets/NSMBU-Red_Pipe.png",
        backYellowPipe  : "static/assets/NSMBU-Yellow_Pipe.png",

        // Map
        tiles           : "static/assets/spaces3.png",
        greenPipe       : "static/assets/WarpPipeGreen.png",
        redPipe         : "static/assets/RedWarpPipeRed.png",

        // Players
        blackPlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (Black)/pieceBlack_border02.png",
        bluePlayer      : "static/assets/boardgamePack_v2/PNG/Pieces (Blue)/pieceBlue_border03.png",
        greenPlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (Green)/pieceGreen_border02.png",
        purplePlayer    : "static/assets/boardgamePack_v2/PNG/Pieces (Purple)/piecePurple_border02.png",
        redPlayer       : "static/assets/boardgamePack_v2/PNG/Pieces (Red)/pieceRed_border02.png",
        whitePlayer     : "static/assets/boardgamePack_v2/PNG/Pieces (White)/pieceWhite_border02.png",
        yellowPlayer    : "static/assets/boardgamePack_v2/PNG/Pieces (Yellow)/pieceYellow_border01.png",

        // Objects
        die1             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",
        die2             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",
        die3             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",
        die4             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",
        die5             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",
        die6             : "static/assets/boardgamePack_v2/PNG/Dice/dieRed1.png",

        coin             : "static/assets/marioCoin.png",
        star             : "static/assets/marioStar.png",
        numbers          : "static/assets/marioNumbers.png",
    };

    imagesPreload(requiredImages, g_images, requestPreloads_audio);
}

function requestPreloads_audio() {
  audioManager.preloadAll(preloadDone);
}

var g_sprites = {};

function preloadDone() {
    g_sprites.ship              = new Sprite(g_images.ship);

    // Background
    g_sprites.background1       = new Sprite(g_images.background1);
    g_sprites.brickBlock        = new Sprite(g_images.brickBlock);

    g_sprites.backGreenPipe     = new Sprite(g_images.backGreenPipe);
    g_sprites.backBluePipe      = new Sprite(g_images.backBluePipe);
    g_sprites.backRedPipe       = new Sprite(g_images.backRedPipe);
    g_sprites.backYellowPipe    = new Sprite(g_images.backYellowPipe);

    // Map
    g_sprites.tiles             = new Sprite(g_images.tiles);
    g_sprites.greenPipe         = new Sprite(g_images.greenPipe);
    g_sprites.redPipe           = new Sprite(g_images.redPipe);


    // Players
    g_sprites.blackPlayer       = new Sprite(g_images.blackPlayer);
    g_sprites.bluePlayer        = new Sprite(g_images.bluePlayer);
    g_sprites.greenPlayer       = new Sprite(g_images.greenPlayer);
    g_sprites.purplePlayer      = new Sprite(g_images.purplePlayer);
    g_sprites.redPlayer         = new Sprite(g_images.redPlayer);
    g_sprites.whitePlayer       = new Sprite(g_images.whitePlayer);
    g_sprites.yellowPlayer      = new Sprite(g_images.yellowPlayer);

    // Objects
    g_sprites.die1              = new Sprite(g_images.die1);
    g_sprites.die2              = new Sprite(g_images.die2);
    g_sprites.die3              = new Sprite(g_images.die3);
    g_sprites.die4              = new Sprite(g_images.die4);
    g_sprites.die5              = new Sprite(g_images.die5);
    g_sprites.die6              = new Sprite(g_images.die6);

    g_sprites.coin              = new Sprite(g_images.coin);
    g_sprites.star              = new Sprite(g_images.star);

    // Numbers
    g_sprites.number0           = new Sprite(g_images.numbers, 50,  195, 0, 2, 50, 55);  // 0
    g_sprites.number1           = new Sprite(g_images.numbers, 140, 195, 0, 2, 38, 55);  // 1

    g_sprites.number2           = new Sprite(g_images.numbers, 225, 195, 0, 2, 45, 55);  // 2
    g_sprites.number3           = new Sprite(g_images.numbers, 315, 195, 0, 2, 45, 55);  // 3
    g_sprites.number4           = new Sprite(g_images.numbers, 405, 195, 0, 2, 45, 55);  // 4
    g_sprites.number5           = new Sprite(g_images.numbers, 500, 195, 0, 2, 50, 55);  // 5
    g_sprites.number6           = new Sprite(g_images.numbers, 595, 195, 0, 2, 45, 55);  // 6
    g_sprites.number7           = new Sprite(g_images.numbers, 685, 195, 0, 2, 45, 55);  // 7
    g_sprites.number8           = new Sprite(g_images.numbers, 780, 195, 0, 2, 45, 55);  // 8
    g_sprites.number9           = new Sprite(g_images.numbers, 875, 195, 0, 2, 45, 55);  // 9

    console.log(g_sprites.number1);

    mapManager.init();
    entityManager.init();
    stateManager.init();


    // play background music
    //audioManager.playAudio(audioManager.bufferArr["cantina"], 0, true);

    main.init();
}

requestPreloads_images();
