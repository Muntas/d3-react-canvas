import React, { Component } from "react";

import "./App.scss";

import SelectionsCircles from "./SelectionsCircles";
import SelectionsCirclesJoins from "./SelectionsCirclesJoins";
import SelectionsCirclesXY from "./SelectionsCirclesXY";
import SelectionsCirclesEvents from "./SelectionsCirclesEvents";
import SelectionsCirclesAppendRemove from "./SelectionsCirclesAppendRemove";
import SelectionsCirclesEachCall from "./SelectionsCirclesEachCall";
import SelectionsCirclesFilterSort from "./SelectionsCirclesFilterSort";
import DataJoins from "./DataJoins";
import EnterExit from "./EnterExit";
import ScaleLinear from "./ScaleLinear";
import Lines from "./Lines";
import Radial from "./Radial";
import Areas from "./Areas";
import StackedAreas from "./StackedAreas";
import Arcs from "./Arcs";
import Tree from "./Tree";
import TreeMap from "./TreeMap";
import Pack from "./Pack";
import Partition from "./Partition";
import Sunburst from "./Sunburst";
import Force from "./Force";

var vizDict = {
  SelectionsCircles,
  SelectionsCirclesJoins,
  SelectionsCirclesXY,
  SelectionsCirclesEvents,
  SelectionsCirclesAppendRemove,
  SelectionsCirclesEachCall,
  SelectionsCirclesFilterSort,
  DataJoins,
  EnterExit,
  ScaleLinear,
  Lines,
  Radial,
  Areas,
  StackedAreas,
  Arcs,
  Tree,
  TreeMap,
  Pack,
  Partition,
  Sunburst,
  Force
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool_loadHub: true,
      string_currentViz: null
    };

    this._action_closeViz = this._action_closeViz.bind(this);
  }

  _set_loadHub(bool_loadHub, callback) {
    console.log("CALLED: _set_loadHub");
    this.setState(
      () => {
        return { bool_loadHub };
      },
      () => {
        console.log("FINISHED: _set_loadHub");
        if (callback) {
          callback();
        }
      }
    );
  }

  _set_currentViz(string_currentViz, callback) {
    console.log("CALLED: _set_currentViz");
    this.setState(
      () => {
        return { string_currentViz };
      },
      () => {
        console.log("FINISHED: _set_currentViz");
        if (callback) {
          callback();
        }
      }
    );
  }

  //////////////////////////////////////////////////

  _render_hub() {
    return Object.keys(vizDict).map(name => {
      return (
        <div key={name}>
          <div className="button" onClick={() => this._action_openViz(name)}>
            {name}
          </div>
        </div>
      );
    });
  }

  _render_viz() {
    var Comp = vizDict[this.state.string_currentViz];
    return <Comp _action_closeViz={this._action_closeViz} />;
  }

  //////////////////////////////////////////////////

  _action_openViz(name) {
    this._set_currentViz(name, () => {
      this._set_loadHub(false);
    });
  }

  _action_closeViz() {
    this._set_loadHub(true);
  }

  render() {
    return (
      <div className="body">
        {this.state.bool_loadHub ? this._render_hub() : this._render_viz()}
        <h1>Notes</h1>
        <p>
          .data returns the update and the enter selections, .data.enter returns
          the enter selections and .data.exit returns the exit selection
        </p>
      </div>
    );
  }
}

export default App;
