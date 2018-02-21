// Course:        CS4242
// Student name:  Gavin Smith
// Student ID:    000654103
// Assignment #:  01
// Due Date:      02/20/2018
// Signature:     ______________
// Score:         ______________

import React, { Component } from 'react';

const INITIAL_SIZE = 8;

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const SUCK = 'SUCK';

class Solution extends Component {
  render() {
    return (
      <div>
        <b>Solution:</b><br/>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Position</th>
              <th>Action</th>
              <td colSpan={this.props.size}>Result</td>
            </tr>
          </thead>
          <tbody>
            {this.props.value.map((x, index) => {
              return (
                <tr key={index}>
                  <th>{index}</th>
                  <td>{x.location}</td>
                  <td>{x.action}</td>
                  {x.state.map((y, j) => {
                    return (
                      <td style={{
                        'background-color': y ? 'brown' : 'white',
                        border: '1px solid #000'
                      }}>{j === x.location ? "X" : " "}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: INITIAL_SIZE,
      world: this.generateWorld(INITIAL_SIZE),
      solution: null,
      initial: Math.floor(Math.random() * INITIAL_SIZE),
    };

    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleInitialChange = this.handleInitialChange.bind(this);
    this.handleSlotChange = this.handleSlotChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
  }

  handleSizeChange(event) {
    var size = event.target.value;
    this.setState({
      size: size,
      world: this.generateWorld(size),
      solution: null,
      initial: Math.floor(Math.random() * size),
    });
  }

  handleInitialChange(event) {
    var initial = event.target.value;
    this.setState({
      initial: initial,
    })
  }

  handleSlotChange(index) {
    return (event)=> {
      var slotBoolVal = event.target.checked;
      var world = this.state.world;
      world[index] = slotBoolVal;
      this.setState({world: world});
    }
  }

  handleCalculate(event) {
    var solution = [];
    var world = [];

    // start at a random location
    var currentLocation = this.state.initial;

    // save the world into this working copy
    this.state.world.forEach(x => world.push(x));
    console.log('world:', world);

    // game-plan (what to do to solve this problem)
    // this is based on the currentl location and world size
    var currentDirection = LEFT;

    // log the initial state
    var worldState = [];
    world.forEach(x => worldState.push(x))
    solution.push({
      action: 'INIT',
      location: currentLocation,
      state: worldState,
    });

    // go until the whole world is clean
    while (true) {
      var action;
      var allClean = true;

      for (var i = 0; i < world.length; i++) {
        if (world[i] === true) {
          allClean = false;
          break;
        }
      }
      if (allClean) {
        break;
      }

      // determine next action
      if (world[currentLocation] === true) {
        world[currentLocation] = false;
        var worldState = [];
        world.forEach(x => worldState.push(x))
        solution.push({
          action: SUCK,
          location: currentLocation,
          state: worldState,
        });
      }
      if (currentDirection === LEFT) {
        if (currentLocation === 0) {
          currentDirection = RIGHT;
        }
        action = LEFT
      } else if (currentDirection === RIGHT) {
        if (currentLocation === (world.length - 1)) {
          currentDirection = LEFT;
        }
        action = RIGHT;
      }

      // apply next action
      switch (action) {
      case LEFT:
        if (currentLocation > 0) {
          currentLocation--;
        }
        break;
      case RIGHT:
        if (currentLocation < (world.length - 1)) {
          currentLocation++;
        }
        break;
      default:
        break;
      }

      // add action to the solution list
      var worldState = [];
      world.forEach(x => worldState.push(x))
      solution.push({
        action: action,
        location: currentLocation,
        state: worldState,
      });
    }
    console.log('solution:', solution);

    this.setState({solution: solution});
    event.preventDefault();
  }

  generateWorld(size) {
    var result = [];
    for (var i = 0; i < size; i++) {
      var random_boolean = Math.random() >= 0.5;
      result.push(random_boolean);
    }
    return result
  }

  render() {
    return (
      <div>
        <header>
          <h1>VacuumBot</h1>
        </header>
        <p>
          World Size: <input type="number" value={this.state.size} onChange={this.handleSizeChange} />
        </p>
        <p>
          Initial Position: <input type="number" value={this.state.initial} onChange={this.handleInitialChange} />
        </p>
        {this.state.world.map((x, index) => {
          return (
            <span key={index}>
              <input
                type="checkbox"
                checked={x}
                onChange={this.handleSlotChange(index)}
              />
            </span>
          );
        })}<br/><br/>
        <button onClick={this.handleCalculate}>Solve</button>
        <br/><br/>
        {this.state.solution != null
          ? <Solution value={this.state.solution} size={this.state.size}/>
          : <span/>
        }
      </div>
    );
  }
}

export default App;
