import React, { Component } from "react";
import * as d3 from "d3";

class SelectionsCirclesAppendRemove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true
    };
    this._flip_update = this._flip_update.bind(this);
    this._append = this._append.bind(this);
  }

  STORE = [];

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
  }

  _refresh(index, STORE) {
    STORE.splice(index, 1);
    var svg = d3.select("svg");

    svg
      .selectAll("g>text")
      .data(STORE)
      .text((d, i) => i);
  }

  _append() {
    var width = 1000;
    var height = 300;
    var r = 50;
    var svg = d3.select("svg");
    var _refresh = this._refresh;
    var STORE = this.STORE;

    this.STORE.push({
      x: r + Math.random() * (width - 2 * r),
      y: r + Math.random() * (height - 2 * r)
    });

    var group = svg
      .append("g")
      .data([this.STORE[this.STORE.length - 1]])
      .attr("index", this.STORE.length - 1)
      .on("click", function() {
        var index = d3.select(this).attr("index");
        d3.select(this).remove();
        _refresh(index, STORE);
      })
      .attr("transform", d => `translate(${d.x},${d.y})`);

    group
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", r)
      .attr("fill", "orange");

    group
      .append("text")
      .text(this.STORE.length - 1)
      .attr("transform", `translate(${r / 3},${r})`)
      .attr("font-size", "5rem")
      .attr("font-family", "Helvetica")
      .attr("font-weight", "bold")
      .attr("fill", "#bbbbbb");
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    this._setup(width, height);
  }

  componentDidUpdate() {}

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
        <p className="button" onClick={this._append}>
          append
        </p>
      </div>
    );
  }
}

export default SelectionsCirclesAppendRemove;
