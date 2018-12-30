import React, { Component } from "react";
import * as d3 from "d3";

class Force extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null
    };
    this.sim = undefined;
    this.d3_STORE = {};
    this._flip_update = this._flip_update.bind(this);
    this._tick = this._tick.bind(this);
    this._action_addForceCenter = this._action_addForceCenter.bind(this);
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

  _action_addForceCenter() {
    this.sim.force("center", d3.forceCenter(100, 100));
    this.sim.restart();
  }

  //////////////////////////////////////////////////

  _setup() {
    d3.select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _start_sim() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    this.sim = d3
      .forceSimulation(this.state.array_data)
      .force("charge", d3.forceManyBody().strength(2))
      .force(
        "center",
        d3.forceCenter(
          this.state.number_width / 2,
          this.state.number_height / 2
        )
      )
      .force("collision", d3.forceCollide().radius(d => d.radius))
      .on("tick", this._tick);
  }

  _tick() {
    var svg = d3
      .select("svg")
      .selectAll("circle")
      .data(this.state.array_data);

    svg
      .enter()
      .append("circle")
      .attr("r", d => d.radius)
      .attr("fill", "darkblue")
      .merge(svg)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    svg.exit().remove();
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1500;
    var height = 500;
    var circles = 100;
    var data = [];
    for (var i = 0; i < circles; i++) {
      data.push({ radius: Math.random() * 25 });
    }

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this._start_sim();
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bool_update !== this.state.bool_update) {
      var circles = 100;
      var data = [];
      for (var i = 0; i < circles; i++) {
        data.push({ radius: Math.random() * 25 });
      }

      this._set_data(data, () => {
        this._setup();
        this._start_sim();
      });
    }
  }

  componentWillUnmount() {
    this.sim.stop();
  }
  //////////////////////////////////////////////////_action_setTreeType

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
        <p onClick={this._action_addForceCenter} className="button">
          Add force center
        </p>
        <svg />
      </div>
    );
  }
}

export default Force;
