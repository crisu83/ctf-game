import React, { Component } from 'react';

class Loader extends Component {
  render() {
    return <div className="loader">{this.props.children}</div>;
  }
}

export default Loader;
