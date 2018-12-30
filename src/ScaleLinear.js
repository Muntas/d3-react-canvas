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
  "interpolateRainbow",
  "interpolateCubehelixDefault"
];

class ScaleLinear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      array_data: [],
      number_width: null,
      number_height: null,
      colorInterpolator: null
    };
    this._flip_update = this._flip_update.bind(this);
    this._draw_linear = this._draw_linear.bind(this);
    this._draw_sqrt = this._draw_sqrt.bind(this);
    this._draw_colorInterpolate = this._draw_colorInterpolate.bind(this);
    this._draw_quantize = this._draw_quantize.bind(this);
    this._draw_band = this._draw_band.bind(this);
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

  _set_colorInterpolator(colorInterpolator, callback) {
    console.log("CALLED: _set_colorInterpolator");
    this.setState(
      () => {
        return { colorInterpolator };
      },
      () => {
        console.log("FINISHED: _set_colorInterpolator");
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

    svg
      .selectAll(".circ")
      .data(this.state.array_data)
      .enter()
      .append("circle")
      .classed("circ", true);
  }

  _draw_linear() {
    var svg = d3.select("svg");

    var extent = d3.extent(this.state.array_data, d => d.point1);

    var t = d3
      .transition()
      .duration(1000)
      .ease(d3.easeLinear);

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length])
      .range([this.state.number_width / 10, (4 * this.state.number_width) / 5]);

    var rScale = d3
      .scaleLinear()
      .domain(extent)
      .range([this.state.number_height / 40, this.state.number_height / 5]);

    var colorScale = d3
      .scaleLinear()
      .domain(extent)
      .range(["blue", "yellow"]);

    svg
      .selectAll(".circ")
      .data(this.state.array_data)
      .attr("cy", this.state.number_height / 2)
      .attr("cx", (d, i) => xScale(i))
      .attr("r", (d, i) => rScale(d.point1))
      .attr("fill", d => colorScale(d.point1));
  }

  _draw_sqrt() {
    var svg = d3.select("svg");

    var extent = d3.extent(this.state.array_data, d => d.point1);

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length])
      .range([this.state.number_width / 10, (4 * this.state.number_width) / 5]);

    var rScale = d3
      .scaleSqrt()
      .domain(extent)
      .range([this.state.number_height / 40, this.state.number_height / 5]);

    var colorScale = d3
      .scaleSqrt()
      .domain(extent)
      .range(["blue", "yellow"]);

    svg
      .selectAll(".circ")
      .data(this.state.array_data)
      .attr("cy", this.state.number_height / 2)
      .attr("cx", (d, i) => xScale(i))
      .attr("r", (d, i) => rScale(d.point1))
      .attr("fill", d => colorScale(d.point1));
  }

  _draw_colorInterpolate() {
    var randomInterpolator =
      interpolators[Math.floor(Math.random() * interpolators.length)];

    this._set_colorInterpolator(randomInterpolator, () => {
      var svg = d3.select("svg");

      var extent = d3.extent(this.state.array_data, d => d.point1);

      var xScale = d3
        .scaleLinear()
        .domain([0, this.state.array_data.length])
        .range([
          this.state.number_width / 10,
          (4 * this.state.number_width) / 5
        ]);

      var rScale = d3
        .scaleLinear()
        .domain(extent)
        .range([this.state.number_height / 40, this.state.number_height / 5]);

      var colorScale = d3
        .scaleSequential()
        .domain(extent)
        .interpolator(d3[this.state.colorInterpolator]);

      svg
        .selectAll(".circ")
        .data(this.state.array_data)
        .attr("cy", this.state.number_height / 2)
        .attr("cx", (d, i) => xScale(i))
        .attr("r", d => rScale(d.point1))
        .attr("fill", d => colorScale(d.point1));
    });
  }

  _draw_quantize() {
    var svg = d3.select("svg");

    var extent = d3.extent(this.state.array_data, d => d.point1);

    var xScale = d3
      .scaleLinear()
      .domain([0, this.state.array_data.length])
      .range([this.state.number_width / 10, (4 * this.state.number_width) / 5]);

    var rScale = d3
      .scaleQuantize()
      .domain(extent)
      .range([
        this.state.number_height / 20,
        this.state.number_height / 10,
        this.state.number_height / 5
      ]);

    var colorScale = d3
      .scaleQuantize()
      .domain(extent)
      .range(["blue", "green", "yellow", "red"]);

    svg
      .selectAll(".circ")
      .data(this.state.array_data)
      .attr("cy", this.state.number_height / 2)
      .attr("cx", (d, i) => xScale(i))
      .attr("r", (d, i) => rScale(d.point1))
      .attr("fill", d => colorScale(d.point1));
  }

  _draw_band() {
    var svg = d3.select("svg");

    svg.selectAll("svg>*").remove();

    var domain = [];
    for (var i = 0; i < this.state.array_data.length; i++) {
      domain.push(i);
    }

    var scale = d3
      .scaleBand()
      .domain(domain)
      .range([0, this.state.number_height])
      .paddingInner(0.15);

    var widthExtent = d3.extent(this.state.array_data, d => d.point1);

    var widthScale = d3
      .scaleLinear()
      .domain(widthExtent)
      .range([this.state.number_width / 5, this.state.number_width / 2]);

    svg
      .selectAll("rect")
      .data(this.state.array_data)
      .enter()
      .append("rect")
      .attr("y", (d, i) => scale(i))
      .attr("height", scale.bandwidth())
      .attr("width", d => widthScale(d.point1))
      .attr("fill", "orange");
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1000;
    var height = 300;
    var data = [
      { point1: 1, label: "a" },
      { point1: 25, label: "b" },
      { point1: 48, label: "c" },
      { point1: 20, label: "d" },
      { point1: 12, label: "e" },
      { point1: 87, label: "f" },
      { point1: 65, label: "g" },
      { point1: 40, label: "h" }
    ];

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this._draw_linear();
        });
      });
    });
  }

  componentDidUpdate() {
    d3.selectAll("svg>*").remove();
    this._setup();
    this._draw_linear();
  }

  //////////////////////////////////////////////////

  render() {
    console.log("~~~RENDER~~~");
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          Run rerender before changing charts after running band
        </p>
        <p>Current color interpolator:</p>
        <p>{this.state.colorInterpolator}</p>
        <p onClick={this.props._action_closeViz} className="button">
          close
        </p>
        <p onClick={this._flip_update} className="button">
          rerender
        </p>
        <p onClick={this._draw_linear} className="button">
          Linear
        </p>
        <p onClick={this._draw_sqrt} className="button">
          Square
        </p>
        <p onClick={this._draw_colorInterpolate} className="button">
          Color interpolator
        </p>
        <p onClick={this._draw_quantize} className="button">
          Quantize
        </p>
        <p onClick={this._draw_band} className="button">
          Band
        </p>
        <svg />
      </div>
    );
  }
}

export default ScaleLinear;
