import React, { Component } from "react";
import AnswerCard from "./AnswerCard";

export default class ReadingDisplay extends Component {
  render() {
    let maxPoints = -1;
    if (
      this.props.scoringDetails.pointsArray &&
      this.props.scoringDetails.pointsArray.length > 0
    ) {
      maxPoints = this.props.scoringDetails.pointsArray.reduce((a, b) => {
        return Math.max(a, b);
      });
    }
    return (
      <div>
        <div className="game-panel has-text-centered">
          <h1 className="is-size-2">{this.props.prompt.text}</h1>
        </div>
        <div className="reading-answers-view">
          {this.props.prompt.answers &&
            this.props.prompt.answers.map((answer, answerIndex) => {
              let isWinner =
                this.props.scoringDetails.pointsArray &&
                this.props.scoringDetails.pointsArray[answerIndex] ===
                  maxPoints;
              return (
                <AnswerCard
                  key={answerIndex}
                  text={answer[1]}
                  playerData={this.props.getPlayerInfoById(answer[0])}
                  votingIsComplete={this.props.votingIsComplete}
                  basePoints={
                    this.props.scoringDetails.pointsArray &&
                    this.props.scoringDetails.pointsArray[answerIndex]
                  }
                  isShutout={
                    this.props.scoringDetails.isShutout &&
                    this.props.scoringDetails.shutoutIndex === answerIndex
                  }
                  isWinner={isWinner}
                  shutoutPoints={this.props.scoringDetails.shutoutPoints}
                  voters={Object.entries(this.props.votingResults)
                    .filter((entry) => {
                      return entry[1] === answerIndex;
                    })
                    .map((entry) => {
                      return this.props.getPlayerInfoById(entry[0]);
                    })} // FIXME performance?
                ></AnswerCard>
              );
            })}
        </div>
      </div>
    );
  }
}
