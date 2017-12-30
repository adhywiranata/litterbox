import React from 'react';
import logo from './pusheen.gif';
import './App.css';
import Editor from './Editor';

export default () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">LitterBox</h1>
    </header>
    <Editor />
  </div>
);
