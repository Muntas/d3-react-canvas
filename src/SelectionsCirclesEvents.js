import React, { Component } from "react";
import * as d3 from "d3";

class SelectionsCirclesEvents extends Component {
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

  _setup(width, height, nrCircles, r) {
    var svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height);

    for (var i = 0; i < nrCircles; i++) {
      svg
        .append("circle")
        .attr("cx", (i * width) / nrCircles + width / (2 * nrCircles))
        .attr("cy", height / 2)
        .attr("r", r)
        .attr("fill", "#eeeeee");
    }
  }

  _change(data) {
    d3.selectAll("circle")
      .data(data)
      .on("click", (d, i) => {
        d3.select(".status").text(
          `circle clicked: ${i} , it's random data is ${d}`
        );
      })
      .on("mouseenter", function(d, i) {
        d3.select(this).attr("fill", "orange");
      })
      .on("mouseleave", function(d, i) {
        d3.select(this).attr("fill", "#eeeeee");
      });
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
    var nrCircles = 4;
    var data = [];
    for (var i = 0; i < nrCircles; i++) {
      data.push(Math.random());
    }
    this._change(data);
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
        <p className="status">a circle has not been clicked</p>
      </div>
    );
  }
}

export default SelectionsCirclesEvents;
