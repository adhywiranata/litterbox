/* eslint no-eval: "off" */
/* eslint global-require: "off" */

import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/solarized_light';
import 'brace/theme/solarized_dark';

import { parseStringToJSX } from './helpers';

const jsx = React.createElement;

const smallBtnStyle = {
  margin: 10,
  backgroundColor: '#353535',
  color: '#FFFFFF',
  border: 0,
  borderRadius: 4,
  outline: 'none',
  cursor: 'pointer',
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
  padding: 0,
  boxSizing: 'border-box',
  border: '1px solid rgba(0,0,0,0.1)',
};

const textEditorPaneStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: 20,
};

export default class FullEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '// code javascript here.. 🐱',
      htmlMarkup: '<!-- code HTML here.. 🐱 -->',
      cssCode: '/* code CSS here.. 🐱 */',
      mergedHtmlCssScript: '',
      logs: [],
      err: '',
      moduleErr: '',
      reactTree: [],
    };
  }

  componentDidMount() {
    this._setEditorEnvironment();
  }

  onChangeJSCode = (code) => {
    this.setState({ code });
  }

  onChangeHTMLCode = (htmlMarkup) => {
    this.setState({ htmlMarkup });
  }

  onChangeCSSCode = (cssCode) => {
    this.setState({ cssCode });
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

  _runLiteJSCode = () => {
    window.localLogs = [];
    const { code } = this.state;
    try {
      const editorFriendlyCode = code.replace(/console.log/g, 'editor.log');
      eval(editorFriendlyCode);
      this.setState({ logs: window.localLogs });
      this.setState({ err: '' });
    } catch (e) {
      this.setState({ err: String(e) });
    }
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
    const reactTree = parseStringToJSX(this.state.code);
    this.setState({ reactTree });
  }

  _runHtmlCode = () => {
    const pureHtmlMarkup = this.state.htmlMarkup;
    let mergedScript = '';
    const cssStyles = this.state.cssCode;
    const cssToInject = `<style>${cssStyles}</style>`;
    // inject css script inside <head>
    if (pureHtmlMarkup.includes('<head>')) {
      const headTagEndPos = pureHtmlMarkup.indexOf('<head>') + 6;
      mergedScript = pureHtmlMarkup.slice(0, headTagEndPos) + cssToInject + pureHtmlMarkup.slice(headTagEndPos);
    }

    // when <head> not found, inject css script on top
    if (!pureHtmlMarkup.includes('<head>')) {
      mergedScript = cssToInject + pureHtmlMarkup;
    }

    this.setState({ mergedHtmlCssScript: mergedScript });
  }

  _renderEditorPane = (languageMode) => {
    if (languageMode === 'js' || languageMode === 'js-lite') {
      const runnerFunction = languageMode === 'js' ? this._runJSCode : this._runLiteJSCode;

      return (
        <div style={{ flex: 1 }}>
          <div style={textEditorPaneStyle}>
            <h3>{languageMode === 'js-lite' && 'Lite'} JS Editor</h3>
            <button onClick={runnerFunction} style={smallBtnStyle}>
              <strong>RUN JS CODE</strong>
            </button>
          </div>
          <AceEditor
            mode="javascript"
            theme="solarized_light"
            onChange={this.onChangeJSCode}
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
            <button
              onClick={this._runReactCode}
              style={smallBtnStyle}
            >
              <strong>RUN REACT CODE</strong>
            </button>
          </div>
          <AceEditor
            mode="javascript"
            theme="solarized_light"
            onChange={this.onChangeJSCode}
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

    if (languageMode === 'html') {
      return (
        [
          <div style={{ flex: 1 }} key="_htmlEditorKey">
            <div style={textEditorPaneStyle}>
              <h3>HTML Editor</h3>
            </div>
            <AceEditor
              mode="html"
              theme="solarized_light"
              onChange={this.onChangeHTMLCode}
              value={this.state.htmlMarkup}
              name="ace-editor"
              editorProps={{ $blockScrolling: true }}
              fontSize={16}
              width="100%"
              height="70vh"
            />
          </div>,
          <div style={{ flex: 1 }} key="_cssEditorKey">
            <div style={textEditorPaneStyle}>
              <h3>CSS Editor</h3>
              <button
                onClick={this._runHtmlCode}
                style={smallBtnStyle}
              >
                <strong>RENDER PAGE</strong>
              </button>
            </div>
            <AceEditor
              mode="css"
              theme="solarized_dark"
              onChange={this.onChangeCSSCode}
              value={this.state.cssCode}
              name="ace-editor"
              editorProps={{ $blockScrolling: true }}
              fontSize={16}
              width="100%"
              height="70vh"
            />
          </div>,
        ]
      );
    }

    return null;
  }

  _renderConsolePane = (languageMode) => {
    if (languageMode !== 'html') {
      return (
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
      );
    }

    return null;
  }

  _renderOutputPane = (languageMode) => {
    if (languageMode === 'react') {
      return (
        <div style={{ flex: 1 }}>
          <h3>React Output</h3>
          <div style={outputPaneStyle}>
            {this.renderReactTree()}
          </div>
        </div>
      );
    }

    if (languageMode === 'html') {
      return (
        <div style={{ flex: 1 }}>
          <h3>Output</h3>
          <div style={outputPaneStyle}>
            <iframe
              srcDoc={this.state.mergedHtmlCssScript}
              title="HTML"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  renderTreeRecursively = (jsxToRender) => {
    // jsxToRender is an array containing [{ tag, props, or textNode }]
    const jsxParent = { ...jsxToRender[0] };

    if (jsxToRender.length === 0) {
      return null;
    }

    if (jsxToRender.length === 1 && !!jsxParent.textNode) {
      return jsxParent.textNode;
    }

    const remainder = jsxToRender.slice(1);

    return jsx(
      jsxParent.tag,
      jsxParent.props,
      this.renderTreeRecursively(remainder),
    );
  }

  renderReactTree = () => {
    const renderer = this.renderTreeRecursively(this.state.reactTree);
    console.log(renderer);
    return renderer;
  }

  render() {
    const { languageMode } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {this._renderEditorPane(languageMode)}
        {this._renderConsolePane(languageMode)}
        {this._renderOutputPane(languageMode)}
      </div>
    );
  }
}
