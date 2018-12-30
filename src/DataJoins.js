import React, { Component } from "react";
import * as d3 from "d3";

class DataJoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true
    };
    this._flip_update = this._flip_update.bind(this);
    this.STORE = [];
  }

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  //////////////////////////////////////////////////

  _setup(width, height) {
    var svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    this.STORE.forEach(() => {
      svg.append("circle");
    });
  }

  _change(width, height, r) {
    d3.selectAll("circle")
      .data(this.STORE)
      .attr("r", d => d.dataNumber * r)
      .attr("fill", "#bbbbbb")
      .attr("cx", d => r + (width - 2 * r) * d.x)
      .attr("cy", d => r + (height - 2 * r) * d.y);
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var nrCircles = 4;
    for (var i = 0; i < nrCircles; i++) {
      var rand = Math.random();
      this.STORE.push({
        dataLetter:
          rand < 0.5 ? (rand < 0.25 ? "a" : "b") : rand < 0.75 ? "c" : "d",
        dataNumber: Math.random(),
        x: Math.random(),
        y: Math.random()
      });
    }
    this._setup(width, height);
  }

  componentDidUpdate() {
    var width = 1000;
    var height = 300;
    var r = 50;
    this._change(width, height, r);
  }

  render() {
    console.log("~~~RENDER~~~");
    return (
      <div>
        <p onClick={this.props._action_closeViz} className="button">
          close
        </p>
        <p onClick={this._flip_update} className="button">
          rerender
        </p>
        <svg />
      </div>
    );
  }
}

export default DataJoins;
