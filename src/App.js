import React from 'react';
import './App.css';
// import LiteEditor from './LiteEditor';
import FullEditor from './FullEditor';

export default () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">LitterBox</h1>
    </header>
    <FullEditor />
  </div>
);
