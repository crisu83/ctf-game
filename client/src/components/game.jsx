import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setState } from '../actions/game';
import createGame from '../factories/game';


function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSetState(state) {
      dispatch(setState(state));
    }
  }
}

export class Game extends Component {
  constructor() {
    super();

    this._clientId = null;
    this._game = null;

    this.handleReady = this.handleReady.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('ready', this.handleReady);
    this.props.socket.on('set_state', this.props.onSetState);
    this.props.socket.on('disconnect', this.handleDisconnect)
  }

  handleReady(clientId, playerProps, state) {
    console.log('CONNECTED (client_id: %s)', clientId, playerProps, state);

    this.props.onSetState(state);

    this._clientId = clientId;
    this._game = createGame(this.props.socket, this.props.store, playerProps, {width: 800, height: 600});
  }

  handleDisconnect() {
    console.log('DISCONNECTED');

    this._game.destroy();
  }

  render() {
    return (
      <div className="game">
        <div className="game-top"></div>
        <div id="container"></div>
        {this.props.children}
        <div className="game-bottom"></div>
      </div>
    );
  }
}

export const GameContainer = connect(mapStateToProps, mapDispatchToProps)(Game);
