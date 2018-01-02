import React from 'react';
import './App.css';
// import LiteEditor from './LiteEditor';
import FullEditor from './FullEditor';
import ModeNav from './ModeNav';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      languageMode: 'js',
    };
  }

  toggleMode = (languageMode) => {
    this.setState({ languageMode });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">LitterBox</h1>
        </header>
        <ModeNav
          mode={this.state.languageMode}
          toggleMode={this.toggleMode}
        />
        <FullEditor languageMode={this.state.languageMode} />
      </div>
    );
  }
}
