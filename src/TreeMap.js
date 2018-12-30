import React, { Component } from "react";
import InputRange from "react-input-range";
import * as d3 from "d3";

import "react-input-range/lib/css/index.css";
import "./TreeMap.scss";

var tilings = [
  "treemapBinary",
  "treemapDice",
  "treemapSlice",
  "treemapSliceDice"
];

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

class TreeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      object_data: {},
      number_width: null,
      number_height: null,
      bool_showLabels: true,
      string_treeType: "recurMixed",
      string_currentTiling: "treemapBinary",
      number_outerPadding: 20,
      number_innerPadding: 5
    };
    this._flip_update = this._flip_update.bind(this);
    this._draw_tree = this._draw_tree.bind(this);
    this._action_setTreeType = this._action_setTreeType.bind(this);
    this._action_setCurrentTiling = this._action_setCurrentTiling.bind(this);
    this._action_change_outerPadding = this._action_change_outerPadding.bind(
      this
    );
    this._action_change_innerPadding = this._action_change_innerPadding.bind(
      this
    );
    this._action_change_showLabels = this._action_change_showLabels.bind(this);
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

  _set_currentTiling(string_currentTiling, callback) {
    console.log("CALLED: _set_currentTiling");
    this.setState(
      () => {
        return { string_currentTiling };
      },
      () => {
        console.log("FINISHED: _set_currentTiling");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_outerPadding(number_outerPadding, callback) {
    console.log("CALLED: _set_outerPadding");
    this.setState(
      () => {
        return { number_outerPadding };
      },
      () => {
        console.log("FINISHED: _set_outerPadding");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_innerPadding(number_innerPadding, callback) {
    console.log("CALLED: _set_innerPadding");
    this.setState(
      () => {
        return { number_innerPadding };
      },
      () => {
        console.log("FINISHED: _set_innerPadding");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_showLabels(bool_showLabels, callback) {
    console.log("CALLED: _set_showLabels");
    this.setState(
      () => {
        return { bool_showLabels };
      },
      () => {
        console.log("FINISHED: _set_showLabels");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////number_outerPadding

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

  _action_change_showLabels(event) {
    this._set_showLabels(event.target.checked, () => {
      this._draw_tree();
    });
  }

  _action_setCurrentTiling(tiling) {
    this._set_currentTiling(tiling, () => {
      this._draw_tree();
    });
  }

  _action_change_outerPadding(outerPadding) {
    this._set_outerPadding(outerPadding, () => {
      this._draw_tree();
    });
  }

  _action_change_innerPadding(innerPadding) {
    this._set_innerPadding(innerPadding, () => {
      this._draw_tree();
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
    var padding = 50;

    var root = d3.hierarchy(this.state.object_data);

    var treeMap = d3.treemap();

    treeMap
      .size([
        this.state.number_width - padding,
        this.state.number_height - padding
      ])
      .paddingOuter(this.state.number_outerPadding)
      .paddingInner(this.state.number_innerPadding)
      .tile(d3[this.state.string_currentTiling]);

    root.sum(d => d.value);

    treeMap(root);

    var descendants = root.descendants();

    var nodes = svg
      .selectAll("g")
      .data(descendants)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 1);

    if (this.state.bool_showLabels) {
      nodes
        .append("text")
        .attr("dx", 4)
        .attr("dy", 14)
        .text(d => d.data.name.substring(0, 2))
        .attr("font-size", "0.7rem");
    }
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1800;
    var height = 2000;
    var data = generateTree(dataGenFunctions[this.state.string_treeType]);

    this._set_data(data, () => {
      this._set_width(width, () => {
        this._set_height(height, () => {
          this._setup();
          this._draw_tree();
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
        <div>
          <p>Current Tilings:</p>
          {tilings.map(tiling => {
            return (
              <p
                className={
                  this.state.string_currentTiling === tiling
                    ? "active button"
                    : "inactive button"
                }
                onClick={() => {
                  this._action_setCurrentTiling(tiling);
                }}
                key={tiling}
              >
                {tiling}
              </p>
            );
          })}
        </div>
        <p>Outer padding:</p>
        <InputRange
          step={0.5}
          maxValue={40}
          minValue={0}
          value={this.state.number_outerPadding}
          onChange={outerPadding =>
            this._action_change_outerPadding(outerPadding)
          }
        />
        <p>Inner padding:</p>
        <InputRange
          step={0.5}
          maxValue={40}
          minValue={0}
          value={this.state.number_innerPadding}
          onChange={innerPadding =>
            this._action_change_innerPadding(innerPadding)
          }
        />
        <div>
          <form>
            <label>
              Show labels:
              <input
                type="checkbox"
                checked={this.state.bool_showLabels}
                onChange={this._action_change_showLabels}
              />
            </label>
          </form>
        </div>
        <svg />
      </div>
    );
  }
}

export default TreeMap;
