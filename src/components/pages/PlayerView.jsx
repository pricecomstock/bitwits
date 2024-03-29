import React, { Component } from "react";
// import PropTypes from "prop-types";
import PlayerInfoSet from "../player/PlayerInfoSet";
import PlayerInfoView from "../player/PlayerInfoView";
import PlayerVote from "../player/PlayerVote";
import PlayerStatusDisplay from "../player/PlayerStatusDisplay";
import Prompt from "../player/Prompt";
import Timer from "../Timer";
import Volume from "../Volume";

import classNames from "classnames";

import createSocketClient from "../../shared/createSocketClient";
import {
  sharedOnMountInit,
  sharedInitialState,
} from "../../shared/sharedViewInit";

import audio from "../../audio/audio";

import C from "../../constants";
const {
  STATE_MACHINE: { STATES },
} = C;

export default class PlayerView extends Component {
  state = {
    ...sharedInitialState(this.props),
    socket: createSocketClient(),

    prompts: [],
    promptIndex: 0,
    playerId: "",
    playerInfo: { emoji: "😾", nickname: "player" },
    editingPlayerInfo: false,

    currentVotingMatchup: {},
    showVotingOptions: false,
  };

  joinRoom = (roomCode) => {
    let existingPlayerIdForRoom = localStorage.getItem(roomCode);
    console.log("existing ID: ", existingPlayerIdForRoom);
    this.state.socket.emit("joinroom", {
      roomCode: roomCode,
      requestedId: existingPlayerIdForRoom,
    });
  };

  joinThisRoom = () => {
    this.joinRoom(this.state.roomCode);
  };

  submitAnswer = (promptId, answer) => {
    this.state.socket.emit(
      "answerprompt",
      {
        promptId,
        answer,
      },

      // Get acknowledgement from server before moving onto next prompt
      // The client would previousy continue as normal
      () => {
        this.setState({ promptIndex: this.state.promptIndex + 1 });
      }
    );
  };

  submitVote = (index) => {
    this.state.socket.emit(
      "vote",
      {
        index: index,
        playerId: this.state.playerId,
      },
      () => {
        audio.playCheck(this.state.volume);
        this.setState({ showVotingOptions: false });
      }
    );
  };

  componentDidMount() {
    sharedOnMountInit(this);
    this.state.socket.on("players", (data) => {
      this.setState({
        playerInfo: data.players.find((player) => {
          return player.playerId === this.state.playerId;
        }),
      });
    });

    this.state.socket.on("playerIdAssigned", (playerData) => {
      console.log("player ID assigned: ", playerData.playerId);
      this.setState({ playerId: playerData.playerId });
      localStorage.setItem(this.state.roomCode, this.state.playerId);
    });

    this.state.socket.on("openEditPlayerInfoForm", () => {
      this.setState({ editingPlayerInfo: true });
    });

    this.state.socket.on("prompts", (data) => {
      console.log("Received Prompts", data);
      this.setState({ prompts: data.prompts, promptIndex: 0 });
    });

    this.state.socket.on("votingoptions", (data) => {
      let votingMode = this.state.gameOptions.rounds[
        this.state.currentRoundIndex
      ].votingMode;
      let showVotingOptions = true;
      // Don't show voting options if player participated in this question
      // and mode is NOT_OWN_QUESTIONS
      if (
        votingMode === C.VOTING_MODES.NOT_OWN_QUESTIONS &&
        // player was asked this prompt
        data.currentVotingMatchup.players.includes(this.state.playerId)
      ) {
        showVotingOptions = false;
      }
      this.setState({
        currentVotingMatchup: data.currentVotingMatchup,
        showVotingOptions: showVotingOptions,
        prompts: [],
        promptIndex: 0,
      });
    });

    this.state.socket.on("kick", () => {
      this.state.socket.close();
      this.props.history.push("/");
    });

    this.joinThisRoom();
  }

  componentWillUnmount() {
    this.state.socket.removeAllListeners();
  }

  render() {
    return (
      <div
        className={classNames("fun-bg", this.state.theme.backgroundClasses)}
        style={this.state.theme.backgroundStyles}
      >
        <div
          className="player-view"
          style={{ color: this.state.theme.textColor }}
        >
          {this.state.editingPlayerInfo &&
            this.state.currentState === STATES.LOBBY && (
              <div className="player-center">
                <PlayerInfoSet
                  socket={this.state.socket}
                  previousName={this.state.playerInfo.nickname}
                  previousEmoji={this.state.playerInfo.emoji}
                  hide={() => this.setState({ editingPlayerInfo: false })}
                ></PlayerInfoSet>
              </div>
            )}
          <div className="player-top-header game-panel">
            {this.state.timerIsVisible && this.state.msRemaining > 0 ? (
              <div>{Math.floor(this.state.msRemaining / 1000)}s</div>
            ) : (
              <div>{this.state.roomCode}</div>
            )}

            <Volume
              muted={this.state.volume === 0}
              toggleMute={this.toggleMute}
            ></Volume>
            {this.state.playerInfo && (
              <PlayerInfoView
                playerInfo={this.state.playerInfo}
                canEdit={this.state.currentState === STATES.LOBBY}
                onEdit={() => this.setState({ editingPlayerInfo: true })}
              ></PlayerInfoView>
            )}
          </div>

          {this.state.timerIsVisible && (
            <div className="player-sub-header">
              <Timer
                msRemaining={this.state.msRemaining}
                msTotal={this.state.msTotal}
              ></Timer>
            </div>
          )}
          {!this.state.connected && (
            <div className="game-panel player-footer">
              <p className="has-text-danger">Disconnected!</p>
            </div>
          )}
          {this.state.prompts.length > this.state.promptIndex && (
            <div className="player-main">
              <Prompt
                prompt={this.state.prompts[this.state.promptIndex]}
                submitAnswer={this.submitAnswer}
                promptIndex={this.state.promptIndex}
                totalPrompts={this.state.prompts.length}
              ></Prompt>
            </div>
          )}
          <PlayerStatusDisplay state={this.state}></PlayerStatusDisplay>
          {this.state.currentState === STATES.VOTING &&
            this.state.showVotingOptions === true && (
              <div className="player-main">
                <PlayerVote
                  submitVote={this.submitVote}
                  currentVotingMatchup={this.state.currentVotingMatchup}
                  filterOwnAnswer={
                    this.state.gameOptions.rounds[this.state.currentRoundIndex]
                      .votingMode === C.VOTING_MODES.NOT_OWN_ANSWER
                  }
                  playerId={this.state.playerId}
                ></PlayerVote>
              </div>
            )}
        </div>
      </div>
    );
  }
}
