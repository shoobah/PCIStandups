import React, {Component} from "react";

class Scheme extends Component {
  render() {
    return (
      <div
          style={{
          fontWeight: "100",
          top: this.props.index * 50 + "px",
          position: "relative"
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Scheme;
