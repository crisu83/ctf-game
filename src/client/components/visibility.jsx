import React, { Component } from 'react';

class Visibility extends Component {
  render() {
    const { isVisible } = this.props;

    return (
      <div {...this.props} style={{ display: isVisible ? 'block' : 'none' }}>
        {this.props.children}
      </div>
    );
  }
}

export default Visibility;
