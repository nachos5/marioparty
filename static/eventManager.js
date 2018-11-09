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
  // events that require no animation (arrows)
  instant_events: [36, 37, 38, 39],
  // we use this to check if our event happens mid movement
  mid_movement_events: [36, 37, 38, 39, 60, 61],
  // we use this to check if our event happens after the movement
  after_movement_events: [],

  // Added
  isBlocksEvent: false,

  getCurrPlayer: function() {
    return stateManager.curr_player.tt_player;
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
      this.isBlocksEvent = true;
      // Change state of pipes, off -> opening
      if(stateManager.game_room.isAnimating === 0) {
        stateManager.game_room.isAnimating = 1;
      }
      // When pipes are opened, opening -> done
      if(stateManager.game_room.isAnimating === 2) {
        entityManager.generateEventBlocks();
        // Event is done, start closing
        this.isBlocksEvent = false;
      }
  },


  // ========= ARROW EVENTS ========== //
  /* the player ignores the prev position tile so we can use that to our advantage
     by setting the prev position to the tile that the arrow is not pointing at */
  // arrow up
  36: function() {
    const player = this.getCurrPlayer();
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row + 1,
                                        column: currTilePos.column});
  },
  // arrow right
  37: function() {
    const player = this.getCurrPlayer();
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row,
                                        column: currTilePos.column - 1});
  },
  // arrow down
  38: function() {
    const player = this.getCurrPlayer();
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row - 1,
                                        column: currTilePos.column});
  },
  // arrow left
  39: function() {
    const player = this.getCurrPlayer();
    const currTilePos = mapManager.currTilePos;
    mapManager.setPrevPosition(player, {row: currTilePos.row,
                                        column: currTilePos.column + 1});
  },



  // ========= PIPE EVENTS ========== //

  // green pipe
  60: function(parameters) {
    if (parameters) {
      this.eventIter = 200;
    }
    this.eventIter--;
    if (this.eventIter > 0) return; // STILL HAVE TO IMPLEMENT ANIMATIONS

    const player = this.getCurrPlayer();
    const myPos = mapManager.getPosition(player);
    const tilePos = mapManager.getTilePositions(60);
    const notMyTile = tilePos.find(obj => obj.row != myPos.row && obj.column != myPos.column);

    mapManager.setPosition(player, notMyTile);
    mapManager.setPrevPosition(player, notMyTile);
    mapManager.diceThrow++; // free movement
    mapManager.eventIsRunning = false; // event is done
  },

};
