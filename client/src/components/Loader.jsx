import React, { Component } from "react";
import "./Loader.scss";
class Loader extends Component {
  state = {};
  dismiss() {
    this.props.unmount();
  }
  render() {
    return (
      <div className="loader-wrapper" id="wrapper">
        <div className="lds-grid">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default Loader;
