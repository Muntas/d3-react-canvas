import React, { Component } from "react";
import * as d3 from "d3";

var interpolators = [
  "interpolateBrBG",
  "interpolatePRGn",
  "interpolatePuOr",
  "interpolateRdBu",
  "interpolateRdYlBu",
  "interpolateRdYlGn"
];

class SelectionsCirclesJoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      number_width: null,
      number_height: null,
      number_r: null,
      number_duration: null,
      number_padding: null,
      string_interpolator: null,
      array_data: []
    };
    this.transition = undefined;
    this._change_data = this._change_data.bind(this);
    this._action_startTransitions = this._action_startTransitions.bind(this);
    this._action_stopTransitions = this._action_stopTransitions.bind(this);
    this._action_setInterpolator = this._action_setInterpolator.bind(this);
  }

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
          number_padding: constants.padding,
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

  _flip_update() {
    this.setState(prevState => {
      return { bool_update: !prevState.bool_update };
    });
  }

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
      .domain([0, 1])
      .interpolator(d3[this.state.string_interpolator]);

    var yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([
        this.state.number_height - this.state.number_padding,
        this.state.number_padding
      ]);

    var t = d3
      .transition()
      .duration(this.state.number_duration)
      .ease(d3.easeLinear);

    var all = svg.selectAll("circle").data(this.state.array_data, d => d.x);

    var exit = all
      .exit()
      .transition(t)
      .attr("r", 0)
      .attr("fill", colorScale(0))
      .remove();

    var enter = all
      .enter()
      .append("circle")
      .attr("cx", d => ((d.x + 1) * this.state.number_width) / 5)
      .attr("cy", yScale(0))
      .attr("r", 0)
      .attr("fill", colorScale(0))
      .merge(all)
      .transition(t)
      .attr("r", this.state.number_r)
      .attr("cy", d => yScale(d.y))
      .attr("fill", d => colorScale(d.y));
  }

  _generate_newData() {
    var data = this.state.array_data;
    for (var i = 0; i < 4; i++) {
      var index = this.state.array_data.findIndex(datum => datum.x === i);
      if (index === -1) {
        if (Math.random() > 0.3) {
          data.push({
            x: i,
            y: Math.random()
          });
        }
      } else {
        if (Math.random() > 0.3) {
          data[index].y = Math.random();
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
      height: 400,
      r: 50,
      duration: 1000,
      interpolator: interpolators[0],
      padding: 60
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

  //////////////////////////////////////////////////

  render() {
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
      </div>
    );
  }
}

export default SelectionsCirclesJoins;
