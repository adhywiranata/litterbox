import React from 'react';
import './App.css';
import FullEditor from './FullEditor';
import ModeNav from './ModeNav';

import { getQueryString } from './helpers';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      languageMode: 'js-lite',
    };
  }

  componentWillMount() {
    const languageMode = getQueryString('mode');
    let isValidMode = true;
    switch (languageMode) {
      case 'js':
      case 'js-lite':
      case 'react':
      case 'html': break;
      default: isValidMode = false;
    }

    if (isValidMode) this.setState({ languageMode });
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
