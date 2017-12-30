/* eslint no-eval: "off" */

import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/solarized_light';

export default class Editor extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '',
      logs: [],
      err: '',
    };
  }

  componentWillMount() {
    window.editor = {};
    window.editor.log = (...args) => {
      this.setState({ logs: [...this.state.logs, ...args] });
      console.log(...args);
    };
  }

  onChange = (code) => {
    this.setState({ logs: [] });
    try {
      const editorFriendlyCode = code.replace(/console.log/g, 'editor.log');
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
        <div>
          <AceEditor
            mode="javascript"
            theme="solarized_light"
            onChange={this.onChange}
            value={this.state.code}
            name="ace-editor"
            editorProps={{ $blockScrolling: true }}
            fontSize={16}
          />
        </div>
        <div id="editor-log" style={{ textAlign: 'left', backgroundColor: '#353535', color: '#FFFFFF', width: 300, height: 300, padding: '5px 20px' }}>
          <p style={{ color: 'red' }}>
            {this.state.err}
          </p>
          {this.state.logs.map((log, i) => <p key={i}>{log}</p>)}
        </div>
        <div>
          <p>
            {this.state.code}
          </p>
        </div>
      </div>
    );
  }
}
