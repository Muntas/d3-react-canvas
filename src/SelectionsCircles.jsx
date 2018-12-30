import React, { Component } from "react";
import * as d3 from "d3";

var interpolators = [
  "interpolateRainbow",
  "interpolateViridis",
  "interpolateInferno",
  "interpolateMagma",
  "interpolatePlasma",
  "interpolateWarm",
  "interpolateCool",
  "interpolateCubehelixDefault"
];

var interpolatrsDiverging = [
  "interpolateBrBG",
  "interpolatePRGn",
  "interpolatePuOr",
  "interpolateRdBu",
  "interpolateRdYlBu",
  "interpolateRdYlGn"
];

class SelectionsCircles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      number_width: null,
      number_height: null,
      number_min: null,
      number_r: null,
      number_duration: null,
      string_interpolator: null,
      array_data: []
    };
    this.transition = undefined;
    this._change_data = this._change_data.bind(this);
    this._action_startTransitions = this._action_startTransitions.bind(this);
    this._action_stopTransitions = this._action_stopTransitions.bind(this);
    this._action_setInterpolator = this._action_setInterpolator.bind(this);
  }

  //////////////////////////////////////////////////

  _set_constants(constants, callback) {
    console.log("CALLED: _set_constants");
    this.setState(
      () => {
        return {
          number_width: constants.width,
          number_height: constants.height,
          number_min: constants.min,
          number_r: constants.r,
          number_duration: constants.duration,
          string_interpolator: constants.interpolator
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
        return {
          array_data
        };
      },
      () => {
        console.log("FINISHED: _set_data");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_interpolator(string_interpolator, callback) {
    console.log("CALLED: _set_interpolator");
    this.setState(
      () => {
        return {
          string_interpolator
        };
      },
      () => {
        console.log("FINISHED: _set_interpolator");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////

  _action_setInterpolator(interpolator) {
    if (this.transition === undefined) {
      this._set_interpolator(interpolator, this._change_data);
    } else {
      this._set_interpolator(interpolator);
    }
  }

  _action_startTransitions() {
    if (this.transition === undefined) {
      this.transition = setInterval(
        this._change_data,
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

  _draw_circles() {
    var svg = d3.select("svg");

    var colorScale = d3
      .scaleSequential()
      .domain([
        this.state.number_r * this.state.number_min,
        this.state.number_r
      ])
      .interpolator(d3[this.state.string_interpolator]);

    var t = d3
      .transition()
      .duration(this.state.number_duration)
      .ease(d3.easeLinear);

    var all = svg.selectAll("circle").data(this.state.array_data, d => d.x);

    var exit = all
      .exit()
      .transition(t)
      .attr("r", 0)
      .attr("fill", colorScale(this.state.number_r * this.state.number_min))
      .remove();

    var enter = all
      .enter()
      .append("circle")
      .attr("cx", d => ((d.x + 1) * this.state.number_width) / 5)
      .attr("cy", this.state.number_height / 2)
      .attr("fill", colorScale(this.state.number_r * this.state.number_min))
      .merge(all)
      .transition(t)
      .attr("r", d => d.r)
      .attr("fill", d => colorScale(d.r));
  }

  _generate_newData() {
    var data = this.state.array_data;
    for (var i = 0; i < 4; i++) {
      var index = this.state.array_data.findIndex(datum => datum.x === i);
      if (index === -1) {
        if (Math.random() > 0.3) {
          data.push({
            x: i,
            r:
              this.state.number_min * this.state.number_r +
              (1 - this.state.number_min) * this.state.number_r * Math.random()
          });
        }
      } else {
        if (Math.random() > 0.3) {
          data[index].r =
            this.state.number_min * this.state.number_r +
            (1 - this.state.number_min) * this.state.number_r * Math.random();
        } else {
          data.splice(index, 1);
        }
      }
    }
    return data;
  }

  _change_data() {
    var data = this._generate_newData();
    this._set_data(data, () => {
      this._draw_circles();
    });
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var constants = {
      width: 1000,
      height: 300,
      min: 0.4,
      r: 100,
      duration: 1000,
      interpolator: interpolators[0]
    };
    this._set_constants(constants, () => {
      var data = this._generate_newData();
      this._set_data(data, () => {
        this._setup();
        this._draw_circles();
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.transition);
  }

  render() {
    console.log("~~~RENDER~~~");
    return (
      <div>
        <p onClick={this.props._action_closeViz} className="button">
          close
        </p>
        <p onClick={this._change_data} className="button">
          Change data
        </p>
        <p onClick={this._action_startTransitions} className="button">
          Start transition
        </p>
        <p onClick={this._action_stopTransitions} className="button">
          Stop transition
        </p>
        <svg />
        <div>
          <p>Current color interpolator (Multi-hue):</p>
          {interpolators.map(interpolator => {
            return (
              <p
                className={
                  this.state.string_interpolator === interpolator
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setInterpolator(interpolator);
                }}
              >
                {interpolator}
              </p>
            );
          })}
        </div>
        <div>
          <p>Current color interpolator (Diverging):</p>
          {interpolatrsDiverging.map(interpolator => {
            return (
              <p
                className={
                  this.state.string_interpolator === interpolator
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setInterpolator(interpolator);
                }}
              >
                {interpolator}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SelectionsCircles;
