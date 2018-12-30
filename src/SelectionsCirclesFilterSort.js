import React, { Component } from "react";
import * as d3 from "d3";

class SelectionsCircles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true
    };
    this._flip_update = this._flip_update.bind(this);
    this._reset = this._reset.bind(this);
  }

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  //////////////////////////////////////////////////

  _setup(width, height, nrCircles, r) {
    var svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    var data = [];
    for (var i = 0; i < nrCircles; i++) {
      data.push({
        data: Math.random() > 0.5 ? "a" : "b",
        x: Math.random(),
        y: Math.random()
      });
    }

    data.forEach(point => {
      svg
        .data([point])
        .append("circle")
        .attr("r", r)
        .attr("fill", "#bbbbbb")
        .attr("cx", d => r + (width - 2 * r) * d.x)
        .attr("cy", d => r + (height - 2 * r) * d.y);
    });
  }

  _reset() {
    d3.selectAll("circle").remove();
    var width = 1000;
    var height = 300;
    var nrCircles = 10;
    var r = 50;
    this._setup(width, height, nrCircles, r);
  }

  _change(selection) {
    selection.filter(d => d.data === "a").style("fill", "orange");
  }

  _sort(selection) {
    selection.sort((x, y) => {
      switch (true) {
        case (x.data === "a" && y.data === "a") ||
          (x.data === "b" && y.data === "b"):
          return 0;
        case x.data === "a" && y.data === "b":
          return 1;
        case x.data === "b" && y.data === "a":
          return -1;
        default:
      }
    });
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var nrCircles = 10;
    var r = 50;
    this._setup(width, height, nrCircles, r);
  }

  componentDidUpdate() {
    var _change = this._change;
    var _sort = this._sort;
    d3.selectAll("circle").call(_change);
    d3.selectAll("circle").call(_sort);
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
        <p onClick={this._reset} className="button">
          reset
        </p>
        <svg />
      </div>
    );
  }
}

export default SelectionsCircles;
