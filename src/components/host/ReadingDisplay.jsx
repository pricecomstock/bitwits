import React, { Component } from "react";

export default class ReadingDisplay extends Component {
  render() {
    return (
      <div>
        <div className="hero is-dark">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="is-size-1">{this.props.prompt.text}</h1>
            </div>
            <div className="container">
              <div className="reading-answers-view">
                {this.props.prompt.answers &&
                  this.props.prompt.answers.map((answer, answerIndex) => {
                    return (
                      <div className="" key={answerIndex}>
                        <div className="box has-text-centered">
                          <h3 className="is-size-2">{answer[1]}</h3>
                          {this.props.votingIsComplete && (
                            <span className="tag is-info is-large">
                              {this.props.getPlayerInfoById(answer[0]).emoji}{" "}
                              {this.props.getPlayerInfoById(answer[0]).nickname}
                            </span>
                          )}
                        </div>
                        {this.props.votingIsComplete && (
                          <div>
                            <div className="tags">
                              <span className="tag is-success is-large">
                                +{" "}
                                {this.props.scoringDetails &&
                                  this.props.scoringDetails.pointsArray[
                                    answerIndex
                                  ]}
                              </span>
                              {this.props.scoringDetails.isShutout &&
                                this.props.scoringDetails.shutoutIndex ===
                                  answerIndex && (
                                  <span className="tag is-success is-light is-large">
                                    + {this.props.scoringDetails.shutoutPoints}{" "}
                                    for shutout!
                                  </span>
                                )}
                            </div>
                            <div className="tags">
                              {Object.entries(this.props.votingResults).map(
                                (entry, voterIndex) => {
                                  let playerId = entry[0];
                                  let voteIndex = entry[1];

                                  if (voteIndex === answerIndex) {
                                    return (
                                      <span
                                        className="tag is-medium is-light"
                                        key={voterIndex}
                                      >
                                        {/* FIXME this is probably very bad performance */}
                                        {
                                          this.props.getPlayerInfoById(playerId)
                                            .emoji
                                        }
                                        &nbsp;
                                        {
                                          this.props.getPlayerInfoById(playerId)
                                            .nickname
                                        }
                                      </span>
                                    );
                                  }
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
