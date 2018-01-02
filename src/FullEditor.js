/* eslint no-eval: "off" */
/* eslint global-require: "off" */

import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/solarized_light';

const jsx = React.createElement;

const smallBtnStyle = {
  margin: 10,
  backgroundColor: '#353535',
  color: '#FFFFFF',
  border: 0,
  borderRadius: 4,
  outline: 'none',
};

const terminalPaneStyle = {
  textAlign: 'left',
  backgroundColor: '#353535',
  color: '#FFFFFF',
  width: '100%',
  height: '70vh',
  padding: '5px 20px',
  boxSizing: 'border-box',
};

const outputPaneStyle = {
  textAlign: 'left',
  backgroundColor: '#FFFFFF',
  width: '100%',
  height: '70vh',
  padding: '5px 20px',
  boxSizing: 'border-box',
  border: '1px solid rgba(0,0,0,0.1)',
};

const textEditorPaneStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: 20,
};

export default class LiteEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '',
      logs: [],
      err: '',
      moduleErr: '',
    };
  }

  componentDidMount() {
    this._setEditorEnvironment();
  }

  onChange = (code) => {
    this.setState({ code });
  }

  _setEditorEnvironment = () => {
    const moduleErr = (moduleName) => {
      this.setState({ moduleErr: `No module named ${moduleName}` });
    };

    window.localLogs = [];
    window.editor = {};

    window.editor.log = (...args) => {
      window.localLogs = [...window.localLogs, ...args];
      console.log(...args);
    };

    window.editor.require = (moduleName) => {
      this.setState({ moduleErr: '' });
      switch (moduleName) {
        case 'lodash': return require('lodash');
        default: moduleErr(moduleName); return {};
      }
    };
  }

  _runJSCode = () => {
    window.localLogs = [];
    const { code } = this.state;
    try {
      let editorFriendlyCode = code.replace(/console.log/g, 'editor.log');
      editorFriendlyCode = editorFriendlyCode.replace(/require/g, 'editor.require');
      eval(editorFriendlyCode);
      this.setState({ logs: window.localLogs });
      this.setState({ err: '' });
    } catch (e) {
      this.setState({ err: String(e) });
    }
  }

  _runReactCode = () => {
    const { code } = this.state;
  }

  reactRender = (jsxStringified) => {
    /*
    case study
    <div>
      Hello world
    </div>
    */
    return jsx('div', null, [
      jsx('p', null, jsx('h1', null, 'hello bigger')),
      jsx('h2', null, 'hello smaller'),
    ]);
  }

  _renderEditor = (languageMode) => {
    if (languageMode === 'js' || languageMode === 'js-lite') {
      return (
        <div style={{ flex: 1 }}>
          <div style={textEditorPaneStyle}>
            <h3>JS Editor</h3>
            <button onClick={this._runJSCode} style={smallBtnStyle}>
              <strong>RUN JS CODE</strong>
            </button>
          </div>
          <AceEditor
            mode="javascript"
            theme="solarized_light"
            onChange={this.onChange}
            value={this.state.code}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
            fontSize={16}
            width="100%"
            height="70vh"
          />
        </div>
      );
    }

    if (languageMode === 'react') {
      return (
        <div style={{ flex: 1 }}>
          <div style={textEditorPaneStyle}>
            <h3>React Editor</h3>
            <button onClick={this._runReactCode} style={smallBtnStyle}>
              <strong>RUN REACT CODE</strong>
            </button>
          </div>
          <AceEditor
            mode="javascript"
            theme="solarized_light"
            onChange={this.onChange}
            value={this.state.code}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
            fontSize={16}
            width="100%"
            height="70vh"
          />
        </div>
      );
    }

    return null;
  }

  render() {
    const { languageMode } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {this._renderEditor(languageMode)}
        <div style={{ flex: 1 }}>
          <h3>Console</h3>
          <div id="editor-log" style={terminalPaneStyle}>
            <p style={{ color: 'red' }}>
              {this.state.moduleErr}
            </p>
            <p style={{ color: 'red' }}>
              {this.state.err}
            </p>
            {this.state.logs.map((log, i) => (
              <p key={i}>{JSON.stringify(log)}</p>
            ))}
          </div>
        </div>
        {/* <div style={{ flex: 1 }}>
          <h3>Test Output</h3>
          <div style={editorPaneStyle}>
            {this.state.code}
          </div>
        </div> */}
        <div style={{ flex: 1 }}>
          <h3>React Output</h3>
          <div style={outputPaneStyle}>
            {this.reactRender(this.state.reactElem)}
          </div>
        </div>
      </div>
    );
  }
}
