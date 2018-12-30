import React, { Component } from "react";
import * as d3 from "d3";

var curveShapes = [
  "curveLinear",
  "curveNatural",
  "curveCardinal",
  "curveCatmullRom",
  "curveMonotoneX",
  "curveStep",
  "curveBasis",
  "curveBasisOpen",
  "curveBasisClosed"
];

class Areas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null,
      string_currentCurve: "curveLinear"
    };
    this._flip_update = this._flip_update.bind(this);
    this._draw_areas = this._draw_areas.bind(this);
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

  _set_currentCurve(string_currentCurve, callback) {
    console.log("CALLED: _set_currentCurve");
    this.setState(
      () => {
        return { string_currentCurve };
      },
      () => {
        console.log("FINISHED: _set_currentCurve");
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

  _action_setCurve(curveShape) {
    this._set_currentCurve(
      curveShape === this.state.string_currentCurve
        ? "curveLinear"
        : curveShape,
      () => {
        this._draw_areas();
      }
    );
  }

  //////////////////////////////////////////////////

  _setup() {
    var svg = d3
      .select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _draw_areas() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var yFull = this.state.array_data.reduce((acc, cur) => {
      acc.push(cur.point1);
      acc.push(cur.point2);
      return acc;
    }, []);

    var yExtent = d3.extent(yFull, d => d);

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length - 1])
      .range([0, this.state.number_width]);

    var yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([
        (9 * this.state.number_height) / 10,
        this.state.number_height / 10
      ]);

    var area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(d => yScale(d.point2))
      .y1(d => yScale(d.point1))
      .curve(d3[this.state.string_currentCurve]);

    svg
      .append("path")
      .attr("d", area(this.state.array_data))
      .attr("fill", "grey");

    svg
      .selectAll(".circles0")
      .data(this.state.array_data)
      .enter()
      .append("circle")
      .classed("circles0", true)
      .attr("r", 5)
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d.point2))
      .attr("fill", "white")
      .attr("stroke-width", 2)
      .attr("stroke", "grey");

    svg
      .selectAll(".circles1")
      .data(this.state.array_data)
      .enter()
      .append("circle")
      .classed("circles1", true)
      .attr("r", 5)
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", d => yScale(d.point1))
      .attr("fill", "white")
      .attr("stroke-width", 2)
      .attr("stroke", "grey");
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var data = [
      { point1: 50, point2: 23, label: "a" },
      { point1: 73, point2: 43, label: "b" },
      { point1: 107, point2: 92, label: "c" },
      { point1: 89, point2: 49, label: "d" },
      { point1: 44, point2: 29, label: "e" },
      { point1: 58, point2: 18, label: "f" },
      { point1: 51, point2: 46, label: "g" },
      { point1: 90, point2: 73, label: "h" }
    ];

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this._draw_areas();
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
        <p onClick={this._draw_areas} className="button">
          Areas
        </p>
        <p />
        <svg />
        <div>
          <p>Current Line Curve:</p>
          {curveShapes.map(curveShape => {
            return (
              <p
                className={
                  this.state.string_currentCurve === curveShape
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setCurve(curveShape);
                }}
              >
                {curveShape}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Areas;
