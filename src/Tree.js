import React, { Component } from "react";
import * as d3 from "d3";

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

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_update: true,
      object_data: {},
      number_width: null,
      number_height: null,
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
    var padding = 50;

    var root = d3.hierarchy(this.state.object_data);

    var tree = d3.tree();

    tree.size([
      this.state.number_width - padding,
      this.state.number_height - padding
    ]);

    tree(root);

    // console.log("Current descendants:");
    //console.log(root.descendants());
    // console.log("Current links:");
    // console.log(root.links());

    var descendants = root.descendants();
    var links = root.links();

    svg
      .selectAll("line.link")
      .data(links)
      .enter()
      .append("line")
      .classed("link", true)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "grey")
      .attr("stroke-width", 1);

    svg
      .selectAll("circle.node")
      .data(descendants)
      .enter()
      .append("circle")
      .classed("node", true)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 4)
      .attr("fill", "blue");
  }

  //////////////////////////////////////////////////

  componentDidMount() {
    var width = 1800;
    var height = 1200;
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
        <svg />
      </div>
    );
  }
}

export default Tree;
