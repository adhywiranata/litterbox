import React from 'react';
import logo from './pusheen.gif';
import './App.css';
import LiteEditor from './LiteEditor';

export default () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">LitterBox</h1>
    </header>
    <LiteEditor />
  </div>
);
