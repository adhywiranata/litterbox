import React from 'react';

const buttonStyle = {
  backgroundColor: 'transparent',
  padding: 10,
  border: '1px solid #FFFFFF',
  color: '#FFFFFF',
  borderRadius: 4,
  fontSize: 14,
  outline: 'none',
  cursor: 'pointer',
  margin: 5,
};

const activeButtonStyle = {
  backgroundColor: '#FFFFFF',
  color: '#353535',
};

export default ({ mode, toggleMode }) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#353535',
      padding: 10,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      color: '#FFFFFF',
    }}
  >
    <span>Pick Modes</span>
    <button
      onClick={() => toggleMode('js-lite')}
      style={{ ...buttonStyle, ...(mode === 'js-lite' ? activeButtonStyle : {}) }}
    >
      JavaScript (Lite)
    </button>
    <button
      onClick={() => toggleMode('js')}
      style={{ ...buttonStyle, ...(mode === 'js' ? activeButtonStyle : {}) }}
    >
      JavaScript
    </button>
    <button
      onClick={() => toggleMode('react')}
      style={{ ...buttonStyle, ...(mode === 'react' ? activeButtonStyle : {}) }}
    >
      React
    </button>
    <button
      onClick={() => toggleMode('html')}
      style={{ ...buttonStyle, ...(mode === 'html' ? activeButtonStyle : {}) }}
    >
      HTML + CSS
    </button>
  </div>
);
