import React, { Component } from "react";
import * as d3 from "d3";

var orders = [
  "stackOrderNone",
  "stackOrderAscending",
  "stackOrderDescending",
  "stackOrderInsideOut",
  "stackOrderReverse"
];

var offsets = [
  "stackOffsetNone",
  "stackOffsetExpand",
  "stackOffsetSilhouette",
  "stackOffsetWiggle"
];

var yOffsetDict = {
  stackOffsetNone: 0,
  stackOffsetExpand: 150,
  stackOffsetSilhouette: 150,
  stackOffsetWiggle: 70
};

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

class StackedAreas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null,
      number_yOffset: 0,
      string_currentDraw: "_draw_bars",
      string_currentOrder: "stackOrderNone",
      string_currentOffset: "stackOffsetNone",
      string_currentShape: "curveLinear"
    };
    this._flip_update = this._flip_update.bind(this);
    this._action_clickChart = this._action_clickChart.bind(this);
    this._action_setOrder = this._action_setOrder.bind(this);
    this._action_setOffset = this._action_setOffset.bind(this);
    this._draw_bars = this._draw_bars.bind(this);
    this._draw_curves = this._draw_curves.bind(this);
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

  _set_currentOrder(string_currentOrder, callback) {
    console.log("CALLED: _set_currentOrder");
    this.setState(
      () => {
        return { string_currentOrder };
      },
      () => {
        console.log("FINISHED: _set_currentOrder");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_currentOffset(string_currentOffset, number_yOffset, callback) {
    console.log("CALLED: _set_currentCurve");
    this.setState(
      () => {
        return { string_currentOffset, number_yOffset };
      },
      () => {
        console.log("FINISHED: _set_currentCurve");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_currentDraw(string_currentDraw, callback) {
    console.log("CALLED: _set_currentDraw");
    this.setState(
      () => {
        return { string_currentDraw };
      },
      () => {
        console.log("FINISHED: _set_currentDraw");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_currentShape(string_currentShape, callback) {
    console.log("CALLED: _set_currentShape");
    this.setState(
      () => {
        return { string_currentShape };
      },
      () => {
        console.log("FINISHED: _set_currentShape");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////currentShape

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

  _action_setOrder(order) {
    this._set_currentOrder(
      order === this.state.string_currentOrder ? "stackOrderNone" : order,
      () => {
        this[this.state.string_currentDraw]();
      }
    );
  }

  _action_setOffset(offset) {
    this._set_currentOffset(
      offset === this.state.string_currentOffset ? "stackOffsetNone" : offset,
      yOffsetDict[
        offset === this.state.string_currentOffset ? "stackOffsetNone" : offset
      ],
      () => {
        this._set_currentDraw("_draw_curves", () => {
          this[this.state.string_currentDraw]();
        });
      }
    );
  }

  _action_setShape(shape) {
    this._set_currentShape(
      shape === this.state.string_currentShape ? "curveLinear" : shape,
      () => {
        this._set_currentDraw("_draw_curves", () => {
          this[this.state.string_currentDraw]();
        });
      }
    );
  }

  _action_clickChart(drawType) {
    this._set_currentDraw(drawType, () => {
      this[this.state.string_currentDraw]();
    });
  }

  //////////////////////////////////////////////////_action_setShape

  _setup() {
    d3.select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _draw_bars() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var xFull = this.state.array_data.reduce((acc, cur) => {
      acc.push(cur.point1);
      acc.push(cur.point2);
      acc.push(cur.point3);
      acc.push(cur.point4);
      acc.push(cur.point5);
      acc.push(cur.point6);
      acc.push(cur.point7);
      return acc;
    }, []);

    var xExtent = d3.extent(xFull, d => d);

    var yScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length - 1])
      .range([
        this.state.number_height / 10,
        (9 * this.state.number_height) / 10
      ]);

    var xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([
        this.state.number_width /
          (5 * Object.keys(this.state.array_data[0]).length),
        this.state.number_width / Object.keys(this.state.array_data[0]).length
      ]);

    var colorScale = d3
      .scaleSequential()
      .domain([0, Object.keys(this.state.array_data[0]).length - 1])
      .interpolator(d3.interpolateRainbow);

    var stacks = d3
      .stack()
      .keys([
        "point1",
        "point2",
        "point3",
        "point4",
        "point5",
        "point6",
        "point7"
      ])
      .order(d3[this.state.string_currentOrder]);

    var g = svg
      .selectAll("g")
      .data(stacks(this.state.array_data))
      .enter()
      .append("g")
      .classed("series", true)
      .style("fill", (d, i) => colorScale(i));

    g.selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("width", d => xScale(d[1]) - xScale(d[0]))
      .attr("x", d => xScale(d[0]))
      .attr("y", (d, i) => yScale(i))
      .attr(
        "height",
        this.state.number_height / (2 + this.state.array_data.length)
      );
  }

  _draw_curves() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var yFull = this.state.array_data.reduce((acc, cur) => {
      acc.push(cur.point1);
      acc.push(cur.point2);
      acc.push(cur.point3);
      acc.push(cur.point4);
      acc.push(cur.point5);
      acc.push(cur.point6);
      acc.push(cur.point7);
      return acc;
    }, []);

    var yExtent = d3.extent(yFull, d => d);

    var yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([
        this.state.number_height,
        this.state.number_height *
          (1 - 1 / Object.keys(this.state.array_data[0]).length)
      ]);

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length - 1])
      .range([
        this.state.number_width / 10,
        (9 * this.state.number_width) / 10
      ]);

    var colorScale = d3
      .scaleSequential()
      .domain([0, Object.keys(this.state.array_data[0]).length - 1])
      .interpolator(d3.interpolateRainbow);

    var area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3[this.state.string_currentShape]);

    var stacks = d3
      .stack()
      .keys([
        "point1",
        "point2",
        "point3",
        "point4",
        "point5",
        "point6",
        "point7"
      ])
      .order(d3[this.state.string_currentOrder])
      .offset(d3[this.state.string_currentOffset]);

    svg
      .selectAll("path")
      .data(stacks(this.state.array_data))
      .enter()
      .append("path")
      .style("fill", (d, i) => colorScale(i))
      .attr("d", area)
      .attr("transform", `translate(0,-${this.state.number_yOffset})`);
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var data = [];

    for (var i = 0; i < 10; i++) {
      data.push({
        point1: 20 + 40 * Math.random(),
        point2: 25 + 50 * Math.random(),
        point3: 30 + 60 * Math.random(),
        point4: 35 + 70 * Math.random(),
        point5: 40 + 80 * Math.random(),
        point6: 45 + 90 * Math.random(),
        point7: 50 + 100 * Math.random()
      });
    }

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this[this.state.string_currentDraw]();
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bool_update !== this.state.bool_update) {
      var data = [];

      for (var i = 0; i < 10; i++) {
        data.push({
          point1: 20 + 40 * Math.random(),
          point2: 25 + 50 * Math.random(),
          point3: 30 + 60 * Math.random(),
          point4: 35 + 70 * Math.random(),
          point5: 40 + 80 * Math.random(),
          point6: 45 + 90 * Math.random(),
          point7: 50 + 100 * Math.random()
        });
      }

      this._set_data(data, () => {
        this[this.state.string_currentDraw]();
      });
    }
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
        <p
          onClick={() => this._action_clickChart("_draw_bars")}
          className="button"
        >
          Bars
        </p>
        <p
          onClick={() => this._action_clickChart("_draw_curves")}
          className="button"
        >
          Curves
        </p>
        <p />
        <svg />
        <div>
          <p>Current Order:</p>
          {orders.map(order => {
            return (
              <p
                className={
                  this.state.string_currentOrder === order
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setOrder(order);
                }}
                key={order}
              >
                {order}
              </p>
            );
          })}
        </div>
        <div>
          <p>Current Offset (works only for curves):</p>
          {offsets.map(offset => {
            return (
              <p
                className={
                  this.state.string_currentOffset === offset
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setOffset(offset);
                }}
                key={offset}
              >
                {offset}
              </p>
            );
          })}
        </div>
        <div>
          <p>Current Curve Shape:</p>
          {curveShapes.map(shape => {
            return (
              <p
                className={
                  this.state.string_currentShape === shape
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setShape(shape);
                }}
                key={shape}
              >
                {shape}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default StackedAreas;
//curveShapes
