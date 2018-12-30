import React, { Component } from "react";
import * as d3 from "d3";
import { Noise } from "noisejs";

var noise = new Noise(Math.random());

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

var easings = [
  "easeLinear",
  "easePolyIn",
  "easePolyOut",
  "easePolyInOut",
  "easeQuadIn",
  "easeQuadOut",
  "easeQuad",
  "easeCubic",
  "easeSin"
];

class Areas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_duration: null,
      number_padding: null,
      number_nrPoints: null,
      number_iteration: null,
      number_increment: null,
      string_easing: null,
      string_currentCurve: "curveLinear"
    };
    this._flip_update = this._flip_update.bind(this);
    this._draw_areas = this._draw_areas.bind(this);
    this._generate_newData_and_draw = this._generate_newData_and_draw.bind(
      this
    );
    this._action_startTransitions = this._action_startTransitions.bind(this);
    this._action_stopTransitions = this._action_stopTransitions.bind(this);
  }

  _set_constants(constants, callback) {
    console.log("CALLED: _set_constants");
    this.setState(
      () => {
        return {
          number_width: constants.width,
          number_height: constants.height,
          number_duration: constants.duration,
          number_padding: constants.padding,
          number_nrPoints: constants.nrPoints,
          number_iteration: constants.iteration,
          number_increment: constants.increment,
          string_easing: constants.easing
        };
      },
      () => {
        console.log("FINISHED: _set_constants");
        if (callback) {
          callback();
        }
      }
    );
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

  _set_easing(string_easing, callback) {
    console.log("CALLED: _set_easing");
    this.setState(
      () => {
        return {
          string_easing
        };
      },
      () => {
        console.log("FINISHED: _set_easing");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////

  _iterate(callback) {
    console.log("CALLED: _iterate");
    this.setState(
      prevState => {
        return {
          number_iteration:
            prevState.number_iteration + this.state.number_increment
        };
      },
      () => {
        console.log("FINISHED: _iterate");
        if (callback) {
          callback();
        }
      }
    );
  }

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

  _action_setEasing(easing) {
    if (this.transition === undefined) {
      this._set_easing(easing, this._generate_newData_and_draw);
    } else {
      this._set_easing(easing);
    }
  }

  _action_startTransitions() {
    if (this.transition === undefined) {
      this.transition = setInterval(
        this._generate_newData_and_draw,
        this.state.number_duration + 5
      );
    }
  }

  _action_stopTransitions() {
    clearInterval(this.transition);
    this.transition = undefined;
  }

  //////////////////////////////////////////////////

  _setup() {
    d3.select("svg")
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

  _draw_areas() {
    var svg = d3.select("svg");

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length - 1])
      .range([
        this.state.number_padding,
        this.state.number_width - this.state.number_padding
      ]);

    var yScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([
        (9 * this.state.number_height) / 10,
        this.state.number_height / 10
      ]);

    var area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(d => yScale(d.yDown))
      .y1(d => yScale(d.yUp))
      .curve(d3[this.state.string_currentCurve]);

    var t = d3
      .transition()
      .duration(this.state.number_duration)
      .ease(d3[this.state.string_easing]);

    var allArea = svg
      .selectAll("path")
      .data(this.state.array_data, d => d.keyUp);
    var enterArea;

    var allCirclesUp = svg
      .selectAll(".circleUp")
      .data(this.state.array_data, d => d.keyUp);
    var enterCirclesUp;

    var allCirclesDown = svg
      .selectAll(".circleDown")
      .data(this.state.array_data, d => d.keyDown);
    var enterCirclesDown;

    if (this.state.number_iteration === this.state.number_increment) {
      var initData = [];
      for (var i = 0; i < this.state.number_nrPoints; i++) {
        initData.push({
          yUp: 1,
          yDown: -1,
          keyUp: i,
          keyDown: -i
        });
      }

      enterArea = allArea
        .enter()
        .append("path")
        .merge(allArea)
        .attr("fill", "grey")
        .attr("d", area(initData))
        .transition(t)
        .attr("d", area(this.state.array_data));

      enterCirclesUp = allCirclesUp
        .enter()
        .append("circle")
        .classed("circleUp", true)
        .attr("r", 5)
        .attr("fill", "grey")
        .attr("stroke-width", 2)
        .attr("stroke", "white")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(1))
        .transition(t)
        .attr("cy", d => yScale(d.yUp));

      enterCirclesDown = allCirclesDown
        .enter()
        .append("circle")
        .classed("circleDown", true)
        .attr("r", 5)
        .attr("fill", "grey")
        .attr("stroke-width", 2)
        .attr("stroke", "white")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(-1))
        .transition(t)
        .attr("cy", d => yScale(d.yDown));
    } else {
      allArea.transition(t).attr("d", area(this.state.array_data));

      allCirclesUp.transition(t).attr("cy", d => yScale(d.yUp));
      allCirclesDown.transition(t).attr("cy", d => yScale(d.yDown));
    }
  }

  _generate_newData_and_draw() {
    this._iterate(() => {
      var data = [];
      for (var i = 0; i < this.state.number_nrPoints; i++) {
        var point1 = noise.simplex2(this.state.number_iteration, i);
        var point2 = noise.simplex2(this.state.number_iteration + 5, i);
        data.push({
          yUp: point1 > point2 ? point1 : point2,
          yDown: point1 > point2 ? point2 : point1,
          keyUp: i,
          keyDown: -i
        });
      }
      this._set_data(data, this._draw_areas);
    });
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var constants = {
      width: 1000,
      height: 300,
      duration: 1000,
      padding: 50,
      nrPoints: 20,
      iteration: 0,
      increment: 0.2,
      easing: easings[0]
    };

    this._set_constants(constants, () => {
      this._setup();
      this._generate_newData_and_draw();
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
        <p onClick={this._generate_newData_and_draw} className="button">
          New data
        </p>
        <p onClick={this._action_startTransitions} className="button">
          Start transition
        </p>
        <p onClick={this._action_stopTransitions} className="button">
          Stop transition
        </p>
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
        <div>
          <p>Current easing:</p>
          {easings.map(easing => {
            return (
              <p
                className={
                  this.state.string_easing === easing
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setEasing(easing);
                }}
              >
                {easing}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Areas;
