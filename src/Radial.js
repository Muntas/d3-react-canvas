import React, { Component } from "react";
import * as d3 from "d3";

class Lines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null
    };
    this._flip_update = this._flip_update.bind(this);
  }

  _set_data(array_data, callback) {
    console.log("CALLED: _set_data");
    this.setState(
      () => {
        return { array_data };
      },
      () => {
        console.log("FINISHED: _set_data");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_width(number_width, callback) {
    console.log("CALLED: _set_width");
    this.setState(
      () => {
        return { number_width };
      },
      () => {
        console.log("FINISHED: _set_width");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_height(number_height, callback) {
    console.log("CALLED: _set_height");
    this.setState(
      () => {
        return { number_height };
      },
      () => {
        console.log("FINISHED: _set_height");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  //////////////////////////////////////////////////

  _setup() {
    var svg = d3
      .select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _draw_radial() {
    var svg = d3.select("svg");
    //svg.selectAll("*").remove();

    //var phiExtent = d3.extent(this.state.array_data, d => d.point1);
    var rExtent = d3.extent(this.state.array_data, d => d.point2);

    var total = this.state.array_data.reduce((acc, cur) => {
      acc += cur.point1;
      return acc;
    }, 0);
    var acc = 0;
    var data = this.state.array_data.map(point => {
      point.phi = acc;
      acc += (point.point1 * 2 * Math.PI) / total;
      return point;
    });

    var rScale = d3
      .scaleLinear()
      .domain(rExtent)
      .range([this.state.number_height / 7, this.state.number_height / 2]);

    var radialLine = d3
      .radialLine()
      .angle(d => d.phi)
      .radius(d => rScale(d.point2));

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", radialLine(data))
      .attr("stroke-width", 2)
      .attr("stroke", "grey")
      .attr("fill", "none")
      .attr(
        "transform",
        `translate(${this.state.number_width / 2},${this.state.number_height /
          2})`
      );
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var data = [
      { point1: 30, point2: 80, label: "a" },
      { point1: 30, point2: 80, label: "b" },
      { point1: 30, point2: 80, label: "c" },
      { point1: 30, point2: 80, label: "d" },
      { point1: 30, point2: 80, label: "e" },
      { point1: 30, point2: 80, label: "f" },
      { point1: 30, point2: 80, label: "g" },
      { point1: 30, point2: 80, label: "h" }
    ].sort((x, y) => x.point1 - y.point1);

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this._draw_radial();
        });
      });
    });
  }
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
        <svg />
      </div>
    );
  }
}

export default Lines;
