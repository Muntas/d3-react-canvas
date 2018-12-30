import React, { Component } from "react";
import * as d3 from "d3";

class EnterExit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true
    };
    this._flip_update = this._flip_update.bind(this);
    this._add = this._add.bind(this);
    this._remove = this._remove.bind(this);
    this.STORE = [];
  }

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  //////////////////////////////////////////////////

  _add_STOREItem() {
    var rand = Math.random();
    this.STORE.push({
      dataLetter:
        rand < 0.5 ? (rand < 0.25 ? "a" : "b") : rand < 0.75 ? "c" : "d",
      dataNumber: Math.random(),
      x: Math.random(),
      y: Math.random()
    });
  }

  _setup(width, height) {
    var svg = d3
      .select("svg")
      .attr("width", width)
      .attr("height", height);
  }

  _add(width, height, r) {
    this._add_STOREItem();
    var svg = d3.select("svg");
    svg
      .selectAll("circle")
      .data(this.STORE)
      .enter()
      .append("circle")
      .attr("r", d => d.dataNumber * r)
      .attr("fill", "#bbbbbb")
      .attr("cx", d => r + (width - 2 * r) * d.x)
      .attr("cy", d => r + (height - 2 * r) * d.y);
  }

  _remove() {
    var svg = d3.select("svg");
    var index = Math.floor(this.STORE.length * Math.random());
    this.STORE.splice(index, 1);
    svg
      .selectAll("circle")
      .data(this.STORE)
      .exit()
      .remove();
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    this._setup(width, height);
  }

  componentDidUpdate() {}

  //////////////////////////////////////////////////

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
        <p onClick={() => this._add(1000, 300, 50)} className="button">
          add
        </p>
        <p onClick={() => this._remove()} className="button">
          remove
        </p>
        <svg />
      </div>
    );
  }
}

export default EnterExit;
