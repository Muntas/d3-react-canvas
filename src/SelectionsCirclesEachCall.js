import React, { Component } from "react";
import * as d3 from "d3";

class SelectionsCirclesEachCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true
    };
    this._flip_update = this._flip_update.bind(this);
  }

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  //////////////////////////////////////////////////

  _d3_EachChangeColor(d) {
    var randomColor = () => {
      var possibles = "abcdef0123456789";
      var colorStr = "#";
      for (var i = 0; i < 6; i++) {
        colorStr += possibles[Math.floor(Math.random() * 16)];
      }
      return colorStr;
    };
    d3.select(this)
      .attr("fill", randomColor)
      .attr("transform", d => `translate(${d * 20},${d * 20})`);
  }

  _d3_CallChangeSize(selection) {
    selection.attr("r", d => (d % 2 === 0 ? 20 : 50));
  }

  //////////////////////////////////////////////////

  _setup(width, height, nrCircles, r) {
    var svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    for (var i = 0; i < nrCircles; i++) {
      svg
        .append("circle")
        .data([i])
        .attr("cx", d => (d * width) / nrCircles + width / (2 * nrCircles))
        .attr("cy", height / 2)
        .attr("r", r)
        .attr("fill", "#eeeeee");
    }
  }

  _change() {
    var _d3_EachChangeColor = this._d3_EachChangeColor;
    var _d3_CallChangeSize = this._d3_CallChangeSize;
    d3.selectAll("circle").each(_d3_EachChangeColor);
    d3.selectAll("circle").call(_d3_CallChangeSize);
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var nrCircles = 4;
    var r = 50;
    this._setup(width, height, nrCircles, r);
  }

  componentDidUpdate() {
    this._change();
  }

  render() {
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

export default SelectionsCirclesEachCall;
