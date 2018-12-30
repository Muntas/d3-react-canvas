import React, { Component } from "react";
import InputRange from "react-input-range";
import * as d3 from "d3";

import "react-input-range/lib/css/index.css";
import "./Sunburst.scss";

var randomName = () => {
  var letters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  var toReturn = "";
  for (var i = 0; i < 10; i++) {
    var index = Math.floor(52 * Math.random());
    toReturn += letters[index];
  }
  return toReturn;
};

var dataGenFunctions = {
  recurMixed: (node, level) => {
    if (Math.random() < 1 - 0.2 * level) {
      node.children = [];
      for (var i = 0; i < 1 + Math.ceil((10 - level) * Math.random()); i++) {
        node.children.push({
          name: randomName()
        });
        dataGenFunctions.recurMixed(
          node.children[node.children.length - 1],
          level + 1
        );
      }
    } else {
      node.value = Math.random();
    }
  },
  recurNotMixed: (node, level) => {
    if (Math.random() < 1 - 0.2 * level) {
      node.children = [];
      for (var i = 0; i < 1 + Math.floor((10 - level) * Math.random()); i++) {
        node.children.push({
          name: randomName()
        });
        dataGenFunctions.recurNotMixed(
          node.children[node.children.length - 1],
          level + 1
        );
      }
    } else {
      node.children = [];
      var nr_of_children = 1 + Math.ceil(5 * Math.random());
      for (var i = 0; i < nr_of_children; i++) {
        node.children.push({
          name: randomName(),
          value: Math.random()
        });
      }
    }
  }
};

var generateTree = type => {
  var data = {
    name: randomName()
  };
  type(data, 0);
  return data;
};

class Sunburst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      object_data: {},
      number_width: null,
      number_height: null,
      number_radius: null,
      string_treeType: "recurMixed"
    };
    this._flip_update = this._flip_update.bind(this);
    this._draw_tree = this._draw_tree.bind(this);
    this._action_setTreeType = this._action_setTreeType.bind(this);
  }

  _set_data(object_data, callback) {
    console.log("CALLED: _set_data");
    this.setState(
      () => {
        return { object_data };
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

  _set_radius(number_radius, callback) {
    console.log("CALLED: _set_radius");
    this.setState(
      () => {
        return { number_radius };
      },
      () => {
        console.log("FINISHED: _set_radius");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_treeType(string_treeType, callback) {
    console.log("CALLED: _set_treeType");
    this.setState(
      () => {
        return { string_treeType };
      },
      () => {
        console.log("FINISHED: _set_treeType");
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

  _action_setTreeType(treeType) {
    this._set_treeType(treeType, () => {
      var data = generateTree(dataGenFunctions[this.state.string_treeType]);
      this._set_data(data, () => {
        this._draw_tree();
      });
    });
  }
  //////////////////////////////////////////////////

  _setup() {
    var svg = d3
      .select("svg")
      .attr("width", this.state.number_width)
      .attr("height", this.state.number_height);
  }

  _draw_tree() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();

    var root = d3.hierarchy(this.state.object_data);

    var partition = d3.partition();

    partition.size([2 * Math.PI, this.state.number_radius]);

    root.sum(d => d.value);
    partition(root);
    var descendants = root.descendants();

    var arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    svg
      .selectAll("path")
      .data(descendants)
      .enter()
      .append("path")
      .classed("sunburstPath", true)
      .attr("fill", "darkblue")
      .attr("d", arc)
      .attr(
        "transform",
        `translate(${this.state.number_width / 2},${this.state.number_height /
          2})`
      );
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1800;
    var height = 1800;
    var radius = 900;
    var data = generateTree(dataGenFunctions[this.state.string_treeType]);

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._set_radius(radius, () => {
            this._setup();
            this._draw_tree();
          });
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.bool_update !== this.state.bool_update) {
      var data = generateTree(dataGenFunctions[this.state.string_treeType]);
      this._set_data(data, () => {
        this._draw_tree();
      });
    }
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
        <p
          onClick={() => this._action_setTreeType("recurMixed")}
          className="button"
        >
          Mixed tree
        </p>
        <p
          onClick={() => this._action_setTreeType("recurNotMixed")}
          className="button"
        >
          Not mixed tree
        </p>
        <svg />
      </div>
    );
  }
}

export default Sunburst;
