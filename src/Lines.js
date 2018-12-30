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
  "curveBundle",
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

class Lines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null,
      number_duration: null,
      number_padding: null,
      number_nrPoints: null,
      number_iteration: null,
      number_increment: null,
      string_easing: null,
      string_currentCurve: "curveLinear"
    };
    this.transition = undefined;
    this._flip_update = this._flip_update.bind(this);
    this._draw_line = this._draw_line.bind(this);
    this._generate_newData_and_draw = this._generate_newData_and_draw.bind(
      this
    );
    this._action_startTransitions = this._action_startTransitions.bind(this);
    this._action_stopTransitions = this._action_stopTransitions.bind(this);
  }

  //////////////////////////////////////////////////

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
        this._draw_line();
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

  _draw_line() {
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

    var line = d3
      .line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.y))
      .curve(d3[this.state.string_currentCurve]);

    var t = d3
      .transition()
      .duration(this.state.number_duration)
      .ease(d3[this.state.string_easing]);

    var allLine = svg.selectAll("path").data(this.state.array_data, d => d.key);
    var enterLine;
    var allCircles = svg
      .selectAll("circle")
      .data(this.state.array_data, d => d.key);
    var enterCircles;

    if (this.state.number_iteration === this.state.number_increment) {
      var initData = [];
      for (var i = 0; i < this.state.number_nrPoints; i++) {
        initData.push({
          y: -1,
          key: i
        });
      }

      enterLine = allLine
        .enter()
        .append("path")
        .merge(allLine)
        .attr("stroke-width", 2)
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("d", line(initData))
        .transition(t)
        .attr("d", line(this.state.array_data));

      enterCircles = allCircles
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "grey")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(-1))
        .transition(t)
        .attr("cy", d => yScale(d.y));
    } else {
      allLine.transition(t).attr("d", line(this.state.array_data));

      allCircles.transition(t).attr("cy", d => yScale(d.y));
    }
  }

  _generate_newData_and_draw() {
    this._iterate(() => {
      var data = [];
      for (var i = 0; i < this.state.number_nrPoints; i++) {
        data.push({
          y: noise.simplex2(this.state.number_iteration, i),
          key: i
        });
      }
      this._set_data(data, this._draw_line);
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
      increment: 0.1,
      easing: easings[0]
    };

    this._set_constants(constants, () => {
      this._setup();
      this._generate_newData_and_draw();
    });
  }

  componentWillUnmount() {
    clearInterval(this.transition);
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

export default Lines;
