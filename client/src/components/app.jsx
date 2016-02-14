import React, { Component } from 'react';
import { GameContainer } from './game';

export class App extends Component {
  render() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
}
