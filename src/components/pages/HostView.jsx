import React, { Component } from "react";
// import PropTypes from "prop-types";

import createSocketClient from "../../createSocketClient";

// https://www.valentinog.com/blog/socket-react/

export default class HostView extends Component {
  state = {
    roomCode: this.props.match.params.code,
    gameState: {
      global: {
        players: [],
        gameState: "lobby",
      },
    },
    adminKey: localStorage.getItem(`${this.props.match.params.code}_adminKey`),
    socket: createSocketClient(),
  };

  joinRoomAsAdmin = (roomCode, adminKey) => {
    this.state.socket.emit("joinroomasadmin", {
      roomCode: roomCode,
      adminKey: adminKey,
    });
  };

  joinThisRoomAsAdmin = () => {
    this.joinRoomAsAdmin(this.state.roomCode, this.state.adminKey);
  };

  startGame = () => {
    this.state.socket.emit("startGame");
  };

  componentDidMount() {
    this.state.socket.on("connection", () => console.log("Connected!"));
    this.state.socket.on("state", (roomState) => {
      console.log("Room state updated");
      this.setState({ roomState: roomState });
    });

    this.state.socket.on("gamestate", (gameState) => {
      console.log("Game state updated");
      let newGameState = { ...this.state.gameState };
      newGameState.global.gameState = gameState;

      this.setState({ gameState: newGameState });
    });
    this.state.socket.on("adminkeyerror", (data) => {
      console.log("Admin Key Error");
    });

    this.joinThisRoomAsAdmin();
  }

  render() {
    return (
      <div>
        <div className="content">
          <h3>Room Code: {this.props.match.params.code}</h3>
          <p>Admin Key: {this.state.adminKey}</p>
          <h3>GameState: {this.state.gameState.global.currentState}</h3>
          <h3>Players:</h3>
          <ul>
            {this.state.gameState.global.players.map((player, index) => (
              <li key={index}>
                {player.emoji} {player.nickname}
              </li>
            ))}
          </ul>
        </div>
        <button className="button is-primary" onClick={this.startGame}>
          Start Game
        </button>
      </div>
    );
  }
}
