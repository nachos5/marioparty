// =================================================== //
/* this manager includes all the events by tile number
   example: to call event 36 you do: eventManager[36](); */
// =================================================== //

/* IF WE HAVE NON-INSTANT EVENTS IT'S IMPORTANT TO SET mapManager.eventIsRunning
   TO FALSE WHEN THEY ARE DONE */

// check step function in the map manager

// our event manager object
let eventManager = {
  eventIter: 0,
  // events that require no animation
  instant_events: [01, 02, 36, 37, 38, 39],
  // we use this to check if our event happens mid movement
  mid_movement_events: [36, 37, 38, 39, 60, 61],
  // we use this to check if our event happens after the movement
  after_movement_events: [01, 02],

  // Added
  isBlocksEvent: false,
  starCost: 10,
  isEvent: false,

  getCurrPlayer: function() {
    return stateManager.curr_player;
  },

  eventIsInstant: function(id) {
    return this.instant_events.includes(id);
  },

  eventIsMidMovement: function(id) {
    return this.mid_movement_events.includes(id);
  },

  // ========= GAMEROOM EVENTS ========== //
  // ROLL EVENT
  rollEvent: function() {

  },

  // BLOCKS EVENT
  blocksEvent: function() {
      this.isEvent = true;
      this.isBlocksEvent = true;
      // Change state of pipes, off -> opening
      if(stateManager.game_room.isAnimating === 0) {
        stateManager.game_room.isAnimating = 1;
      }
      // When pipes are opened, opening -> done
      if(stateManager.game_room.isAnimating === 2) {
        if (entityManager._eventBlocks.length === 0) {
          entityManager.generateEventBlocks();
        }
        stateManager.curr_player.eventPlayer.changeRoom(1);
      }
  },

  closeBlocksEvent: function() {
    // Event is done, start closing
    this.isEvent = false;
    this.isBlocksEvent = false;
    stateManager.curr_player.eventPlayer.changeRoom(0);
    stateManager.callNextTurn();
  },

  36: function() {
    this.blocksEvent();
  },
  37: function() {
    this.blocksEvent();
  },
  38: function() {
    this.blocksEvent();
  },
  39: function() {
    this.blocksEvent();
  },
  01: function() {
    this.blocksEvent();
  },
  02: function() {
    this.blocksEvent();
  },


  // ==== COLLECTABLES ==== //
/*
  // blue tile, gain 3 coins
  01: function() {
    const player = this.getCurrPlayer();
    player.coins += 3;
  },

  // red tile lose 3 coins
  02: function() {
    const player = this.getCurrPlayer();
    player.coins -= 3;
    if (player.coins < 0) {
      player.coins = 0;
    }
  },*/

  /*// star tile
  08: function(parameters) {
    if (parameters) {
      this.eventiter = 200;
    }
    this.eventIter--;

  }*/


  // ========= ARROW EVENTS ========== //
  /* the player ignores the prev position tile so we can use that to our advantage
     by setting the prev position to the tile that the arrow is not pointing at */
  // arrow up
  /*36: function() {
    mapManager.arrows["up"] = true;
  },
  // arrow right
  37: function() {
    mapManager.arrows["right"] = true;
  },
  // arrow down
  38: function() {
    mapManager.arrows["down"] = true;
  },
  // arrow left
  39: function() {
    mapManager.arrows["left"] = true;
  },*/



  // ========= PIPE EVENTS ========== //
  //     pipes give free movement!
  // destination pipe is chosen at random!

  // green pipe, we use the eventIter to control the flow
  60: function(parameters, tileNo=60) {
    const player = this.getCurrPlayer().tt_player;
    const myPos = mapManager.getPosition(player);
    if (parameters) {
      this.eventIter = 100;
    }
    // fade out
    if (this.eventIter > 0) {
      player.alpha -= 0.01;
      if (player.alpha < 0) player.alpha = 0;
      this.eventIter--;
      return;
    }
    // set position to the other pipe (runs only once)
    if (this.eventIter == 0) {
      const tilePos = mapManager.getTilePositions(tileNo); // get all pipes
      // filter out the pipe we are on currently
      const notMyTiles = tilePos.filter(obj => obj.row != myPos.row && obj.column != myPos.column);
      // get 1 random pipe
      const rand = parseInt(Math.random() * notMyTiles.length);
      const notMyTile = notMyTiles[rand];
      // set the player position to the chosen pipe
      mapManager.setPosition(player, notMyTile);
      mapManager.setPrevPosition(player, notMyTile);
      // set eventiter as negative so we only run the last part (fade in)
      this.eventIter = -200;
      return;
    }
    // fade in
    if (this.eventIter < 0) {
      player.alpha += 0.01;
      if (player.alpha > 1) player.alpha = 1;
      this.eventIter++;
    }
    // the event is done
    if (this.eventIter == -100) {
      // pipes give free movement so we go to the next tile
      const tilePos = mapManager.checkForNextValidTiles(player, myPos);
      mapManager.setPosition(player, tilePos); // we go for free to this tile
      mapManager.eventIsRunning = false; // event is done
    }
  },

  // red pipe, same code for both pipes so we just "redirect"
  61: function(parameters) {
    this[60](parameters, 61);
  },

};
