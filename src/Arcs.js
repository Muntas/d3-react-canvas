import React, { Component } from "react";
import InputRange from "react-input-range";
import * as d3 from "d3";

import "react-input-range/lib/css/index.css";

class Arcs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null,
      string_currentChart: "_draw_donut",
      bool_padAngle: false,
      number_padAngle: 1,
      bool_padRadius: false,
      number_padRadius: 1,
      bool_cornerRadius: false,
      number_cornerRadius: 1,
      number_innerRadius: 0.05
    };
    this._flip_update = this._flip_update.bind(this);
    this._action_setChart = this._action_setChart.bind(this);
    this._action_clickChart = this._action_clickChart.bind(this);
    this._action_change_padAngleBool = this._action_change_padAngleBool.bind(
      this
    );
    this._action_change_padAngleNumber = this._action_change_padAngleNumber.bind(
      this
    );
    this._action_change_padRadiusBool = this._action_change_padRadiusBool.bind(
      this
    );
    this._action_change_padRadiusNumber = this._action_change_padRadiusNumber.bind(
      this
    );
    this._action_change_cornerRadiusBool = this._action_change_cornerRadiusBool.bind(
      this
    );
    this._action_change_cornerRadiusNumber = this._action_change_cornerRadiusNumber.bind(
      this
    );
    this._action_change_innerRadius = this._action_change_innerRadius.bind(
      this
    );
  }
  //_action_change_padAngleBool
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

  _set_currentChart(string_currentChart, callback) {
    console.log("CALLED: _set_currentChart");
    this.setState(
      () => {
        return { string_currentChart };
      },
      () => {
        console.log("FINISHED: _set_currentChart");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_padAngle_bool(bool_padAngle, callback) {
    console.log("CALLED: _set_padAngle_bool");
    this.setState(
      () => {
        return { bool_padAngle };
      },
      () => {
        console.log("FINISHED: _set_padAngle_bool");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_padAngle_number(number_padAngle, callback) {
    console.log("CALLED: _set_padAngle_number");
    this.setState(
      () => {
        return { number_padAngle };
      },
      () => {
        console.log("FINISHED: _set_padAngle_number");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_padRadius_bool(bool_padRadius, callback) {
    console.log("CALLED: _set_padRadius_bool");
    this.setState(
      () => {
        return { bool_padRadius };
      },
      () => {
        console.log("FINISHED: _set_padRadius_bool");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_padRadius_number(number_padRadius, callback) {
    console.log("CALLED: _set_padRadius_number");
    this.setState(
      () => {
        return { number_padRadius };
      },
      () => {
        console.log("FINISHED: _set_padRadius_number");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_cornerRadius_bool(bool_cornerRadius, callback) {
    console.log("CALLED: _set_cornerRadius_bool");
    this.setState(
      () => {
        return { bool_cornerRadius };
      },
      () => {
        console.log("FINISHED: _set_cornerRadius_bool");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_cornerRadius_number(number_cornerRadius, callback) {
    console.log("CALLED: _set_cornerRadius_number");
    this.setState(
      () => {
        return { number_cornerRadius };
      },
      () => {
        console.log("FINISHED: _set_cornerRadius_number");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_innerRadius(number_innerRadius, callback) {
    console.log("CALLED: _set_innerRadius");
    this.setState(
      () => {
        return { number_innerRadius };
      },
      () => {
        console.log("FINISHED: _set_innerRadius");
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

  _action_setChart(string_currentChart) {
    this.setState(string_currentChart, () => {
      this[this.state.string_currentChart]();
    });
  }

  _action_clickChart(chartType) {
    this._set_currentChart(chartType, () => {
      this[this.state.string_currentChart]();
    });
  }

  _action_change_padAngleBool(event) {
    this._set_padAngle_bool(event.target.checked, () => {
      this[this.state.string_currentChart]();
    });
  }

  _action_change_padAngleNumber(event) {
    if (event.target.value >= 0) {
      this._set_padAngle_number(event.target.value, () => {
        this[this.state.string_currentChart]();
      });
    }
    event.preventDefault();
  }

  _action_change_padRadiusBool(event) {
    this._set_padRadius_bool(event.target.checked, () => {
      this[this.state.string_currentChart]();
    });
  }

  _action_change_padRadiusNumber(event) {
    if (event.target.value >= 0) {
      this._set_padRadius_number(event.target.value, () => {
        this[this.state.string_currentChart]();
      });
    }
    event.preventDefault();
  }

  _action_change_cornerRadiusBool(event) {
    this._set_cornerRadius_bool(event.target.checked, () => {
      this[this.state.string_currentChart]();
    });
  }

  _action_change_cornerRadiusNumber(event) {
    if (event.target.value >= 0) {
      this._set_cornerRadius_number(event.target.value, () => {
        this[this.state.string_currentChart]();
      });
    }
    event.preventDefault();
  }

  _action_change_innerRadius(innerRadius) {
    this._set_innerRadius(innerRadius, () => {
      this[this.state.string_currentChart]();
    });
  }

  //////////////////////////////////////////////////

  _setup() {
    d3.select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _draw_donut() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var dataFormatted = this._format_data_angles(this.state.array_data);

    var arc = d3
      .arc()
      .innerRadius(this.state.number_height * this.state.number_innerRadius)
      .outerRadius(this.state.number_height / 2)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle);

    if (this.state.bool_padAngle) {
      arc.padAngle((2 * Math.PI * this.state.number_padAngle) / 360);
    }

    if (this.state.bool_padRadius) {
      arc.padRadius(this.state.number_padRadius);
    }

    if (this.state.bool_cornerRadius) {
      arc.cornerRadius(this.state.number_cornerRadius);
    }

    svg
      .selectAll("path")
      .data(dataFormatted)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr(
        "transform",
        `translate(${this.state.number_width / 2},${this.state.number_height /
          2})`
      )
      .attr("fill", "orange");
  }

  _draw_burst() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var dataFormatted = this._format_data_angles(this.state.array_data);

    var rExtent = d3.extent(dataFormatted, d => d.point2);

    var rScale = d3
      .scaleLinear()
      .domain(rExtent)
      .range([this.state.number_height / 10, this.state.number_height / 2]);

    var arc = d3
      .arc()
      .innerRadius(this.state.number_height * this.state.number_innerRadius)
      .outerRadius(d => rScale(d.point2))
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle);

    if (this.state.bool_padAngle) {
      arc.padAngle((2 * Math.PI * this.state.number_padAngle) / 360);
    }

    if (this.state.bool_padRadius) {
      arc.padRadius(this.state.number_padRadius);
    }

    if (this.state.bool_cornerRadius) {
      arc.cornerRadius(this.state.number_cornerRadius);
    }

    svg
      .selectAll("path")
      .data(dataFormatted)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr(
        "transform",
        `translate(${this.state.number_width / 2},${this.state.number_height /
          2})`
      )
      .attr("fill", "orange");
  }

  _return_data() {
    var data = [];
    var acc = 0;
    for (var i = 0; i < 6; i++) {
      var item;
      if (i !== 5) {
        item = ((1 - acc) * Math.random()) / (6 - i);
        acc += item;
      } else {
        item = 1 - acc;
      }
      data.push({
        point1: item,
        point2: Math.random()
      });
    }
    return data;
  }

  _format_data_angles(data) {
    var point1Total = this.state.array_data.reduce((acc, cur) => {
      acc += cur.point1;
      return acc;
    }, 0);

    var acc = 0;
    var dataFormatted = data.map(point => {
      point.startAngle = acc;
      acc += (point.point1 * 2 * Math.PI) / point1Total;
      point.endAngle = acc;
      return point;
    });

    return dataFormatted;
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;

    this._set_width(width, () => {
      this._set_height(height, () => {
        this._set_data(this._return_data(), () => {
          this._setup();
          this[this.state.string_currentChart]();
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bool_update !== this.state.bool_update) {
      this._set_data(this._return_data(), () => {
        this[this.state.string_currentChart]();
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
          onClick={() => this._action_clickChart("_draw_donut")}
          className="button"
        >
          Donut
        </p>
        <p
          onClick={() => this._action_clickChart("_draw_burst")}
          className="button"
        >
          Burst
        </p>
        <p />
        <svg />
        <div>
          <form>
            <label>
              padAngle:
              <input
                type="checkbox"
                checked={this.state.bool_padAngle}
                onChange={this._action_change_padAngleBool}
              />
              <input
                type="text"
                value={this.state.number_padAngle}
                onChange={this._action_change_padAngleNumber}
              />
            </label>
          </form>
        </div>
        <div>
          <form>
            <label>
              padRadius:
              <input
                type="checkbox"
                checked={this.state.bool_padRadius}
                onChange={this._action_change_padRadiusBool}
              />
              <input
                type="text"
                value={this.state.number_padRadius}
                onChange={this._action_change_padRadiusNumber}
              />
            </label>
          </form>
        </div>
        <div>
          <form>
            <label>
              cornerRadius:
              <input
                type="checkbox"
                checked={this.state.bool_cornerRadius}
                onChange={this._action_change_cornerRadiusBool}
              />
              <input
                type="text"
                value={this.state.number_cornerRadius}
                onChange={this._action_change_cornerRadiusNumber}
              />
            </label>
          </form>
        </div>
        <InputRange
          step={0.01}
          maxValue={0.5}
          minValue={0}
          value={this.state.number_innerRadius}
          onChange={innerRadius => this._action_change_innerRadius(innerRadius)}
        />
      </div>
    );
  }
}

export default Arcs;
