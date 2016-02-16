import React, { Component } from 'react';
import { connect } from 'react-redux';
import { now } from 'lodash';
import { beginConnection, endConnection, startLoading, stopLoading } from '../actions/client';
import { setState } from '../actions/game';
import { createGame } from '../factories/game';
import Loader from './loader';

const CONNECT_DELAY = 850;

function mapStateToProps(state) {
  return {
    isConnected: state.client.get('isConnected'),
    isLoading: state.client.get('isLoading'),
    gameState: state.game.toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onConnect() {
      dispatch(beginConnection());
    },
    onDisconnect() {
      dispatch(endConnection());
    },
    onStartLoading() {
      dispatch(startLoading());
    },
    onStopLoading() {
      dispatch(stopLoading());
    },
    onSetState(state) {
      dispatch(setState(state));
    }
  }
}

export class Game extends Component {
  constructor() {
    super();

    this._createdAt = now();
    this._game = null;

    this.handleConnect = this.handleConnect.bind(this);
    this.handleReady = this.handleReady.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  componentDidMount() {
    this.props.onStartLoading();

    this.props.socket.on('connect', this.handleConnect);
    this.props.socket.on('ready', this.handleReady);
    this.props.socket.on('disconnect', this.handleDisconnect);
    this.props.socket.on('set_state', this.props.onSetState);
  }

  handleConnect() {
    console.log('CONNECTED');
  }

  handleReady(clientId, gameData, gameState, playerProps) {
    console.log('READY (client_id: %s)', clientId, gameData, gameState, playerProps);

    // Set the initial game state when the client is ready.
    this.props.onSetState(gameState);

    const delay = CONNECT_DELAY - (now() - this._createdAt);

    setTimeout(() => {
      this._game = createGame(this.props.store, gameData, playerProps, {width: 800, height: 600});

      this.props.onConnect();
      this.props.onStopLoading();
    }, delay);
  }

  handleDisconnect() {
    console.log('DISCONNECTED');

    if (this._game) {
      this._game.destroy();
    }
  }

  render() {
    const { isConnected, isLoading } = this.props;

    return (
      <div className="game">
        {!isConnected ? <Loader/> : null}
        <div id="phaser" style={{display: isConnected && !isLoading ? 'block' : 'none'}}></div>
      </div>
    );
  }
}

export const GameContainer = connect(mapStateToProps, mapDispatchToProps)(Game);
