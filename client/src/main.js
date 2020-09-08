const socket = io();

import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Player from './components/Player';
import { Synth } from 'tone';

const synth = new Synth().toDestination();

class App extends React.Component {
  state = {
    gameInfo: {},
    message: '',
    gameStarted: false,
  };

  componentDidMount() {
    // connect
    socket.on('connect', () => {
      console.log('connected');
    });
    // update players
    socket.on('updateNumPlayers', (gameInfo) => {
      this.setState({
        gameInfo,
      });
    });
    // welcome player
    socket.on('hello', (message) => {
      this.setState({
        message,
      });
    });
    // join the game
    socket.on('startGame', (players) => {
      this.setState({
        gameStarted: true,
      });
    });
    // update game info
    socket.on('updateGameInfoForAll', (gameInfo) => {
      this.setState({
        gameInfo,
      });
    });
    // play audio connected to like btn
    socket.on('makeNoise', (note) => {
      // console.log('makeNoise', note);
      //play a middle 'C' for the duration of an 8th note
      synth.triggerAttackRelease(`${note}3`, '8n');
    });
  }

  /*
   * Player Submits Note and Joins Game
   */
  handleFormSubmit = (event) => {
    event.preventDefault();
    const noteVal = event.target.note.value;
    socket.emit('nameSubmit', noteVal);
  };

  render() {
    return (
      <div className="container">
        <Header numConnected={this.state.gameInfo.numConnected} />
        <main>
          {!this.state.gameStarted ? (
            <>
              <p>{this.state.message}</p>
              <div className="d-flex p-2">
                <form onSubmit={this.handleFormSubmit}>
                  <label htmlFor="noteName">Note Name</label>
                  <select id="noteName" name="note" className="form-control">
                    <option value="e">e</option>
                    <option value="f">f</option>
                    <option value="g">g</option>
                    <option value="a">a</option>
                    <option value="b">b</option>
                    <option value="c">c</option>
                    <option value="d">d</option>
                  </select>
                  <button className="btn btn-primary" type="submit">
                    play
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <p>Play Together</p>
              <div className="d-flex flex-row">
                {this.state.gameInfo.players.map(({ name, id, darkMode }) => (
                  <Player
                    key={id}
                    id={id}
                    name={name}
                    darkMode={darkMode}
                    socket={socket}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    );
  }
}

// mount app
ReactDOM.render(<App />, document.getElementById('root'));
