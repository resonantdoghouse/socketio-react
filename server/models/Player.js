const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(name, socketID) {
    this.id = uuidv4();
    this.socketID = socketID;
    this.name = name;
    this.score = 0;
    this.darkMode = false;
  }
}

module.exports = Player;
