/* eslint no-eval: "off" */

import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/solarized_light';

// import EDITOR_LODASH from 'lodash';

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

    const moduleErr = (moduleName) => {
      this.setState({ moduleErr: `No module named ${moduleName}` });
    };

    window.editor = {};
    window.editor.log = (...args) => {
      this.setState({ logs: [...this.state.logs, ...args] });
      console.log(...args);
    };

    window.editor.require = (moduleName) => {
      this.setState({ moduleErr: '' });
      switch (moduleName) {
        case 'fox': return { name: 'foxy' };
        case 'lodash': return require('lodash');
        default: moduleErr(moduleName); return {};
      }
    };
  }

  onChange = (code) => {
    this.setState({ logs: [] });

    try {
      let editorFriendlyCode = code.replace(/console.log/g, 'editor.log');
      editorFriendlyCode = editorFriendlyCode.replace(/require/g, 'editor.require');
      eval(editorFriendlyCode);
      this.setState({ err: '' });
    } catch (e) {
      this.setState({ err: String(e) });
    }
    this.setState({ code });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <h3>JS Editor</h3>
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
        <div style={{ flex: 1 }}>
          <h3>Console</h3>
          <div id="editor-log" style={{ textAlign: 'left', backgroundColor: '#353535', color: '#FFFFFF', width: '100%', height: '70vh', padding: '5px 20px', boxSizing: 'border-box' }}>
          <p style={{ color: 'red' }}>
              {this.state.moduleErr}
            </p>
            <p style={{ color: 'red' }}>
              {this.state.err}
            </p>
            {this.state.logs.map((log, i) => <p key={i}>{JSON.stringify(log)}</p>)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Test Output</h3>
          <div style={{ backgroundColor: '#F5F5F5', width: '100%', height: '70vh', boxSizing: 'border-box', padding: '5px 20px', textAlign: 'left' }}>
            {this.state.code}
          </div>
        </div>
      </div>
    );
  }
}
