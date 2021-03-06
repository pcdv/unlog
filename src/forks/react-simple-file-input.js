// https://github.com/greena13/react-simple-file-input/blob/master/src/FileInput.js

import React from 'react';
import ReactDOM from 'react-dom';

const objectKeys = Object.keys || require('lodash/keys');

const STYLE = {
  FIELD: {
    display: 'none'
  }
};

const INPUT_FIELD_REF = 'inputField';

const READ_METHOD_ALIASES = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

const SUPPORTED_EVENTS = [
  'onLoadStart',
  'onLoadEnd',
  'onLoad',
  'onAbort',
  'onError'
];


const FileInput = React.createClass({
  propTypes: {
    readAs: React.PropTypes.oneOf(objectKeys(READ_METHOD_ALIASES)),
    onLoadStart: React.PropTypes.func,
    onLoadEnd: React.PropTypes.func,
    onLoad: React.PropTypes.func,
    onAbort: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onError: React.PropTypes.func,
    onProgress: React.PropTypes.func,
    cancelIf: React.PropTypes.func,
    abortIf: React.PropTypes.func
  },

  componentWillMount: function(){
    if (!window.File || !window.FileReader) {
      console.warn(
          'Browser does not appear to support API react-simple-file-input relies upon'
      );
    }
  },

  handleChange: function(event){
    const {readAs, cancelIf, onCancel, onProgress, abortIf, onChange} = this.props;
    const file = event.target.files[0];

    if(onChange){
      onChange(file);
    }

    if(readAs){
      const fileReader = new window.FileReader();

      if(cancelIf && cancelIf(file)){
        if(onCancel){
          onCancel(file);
        }

        return;
      }

      for(let i = 0; i < SUPPORTED_EVENTS.length; i++){
        const handlerName = SUPPORTED_EVENTS[i];

        if(this.props[handlerName]){
          fileReader[handlerName.toLowerCase()] = (fileReadEvent)=>{
            this.props[handlerName](fileReadEvent, file);
          };
        }
      }

      if(typeof abortIf !== 'undefined'){
        fileReader.onprogress = (event)=>{
          if(abortIf(event, file)){
            fileReader.abort();
          } else if(onProgress){
            onProgress(event, file);
          }
        }
      } else if(onProgress) {
        fileReader.onprogress = onProgress;
      }

      fileReader[READ_METHOD_ALIASES[readAs]](file);
    }

  },

  handleClick: function(){
    ReactDOM.findDOMNode(this.refs[INPUT_FIELD_REF]).click();
  },

  render: function () {
    return(
      <span onClick={this.handleClick} >

        <input {...sanitize(this.props)}
          type='file'
          onChange={this.handleChange} ref={INPUT_FIELD_REF}
          style={this.props.children ? STYLE.FIELD : {}}
          children={null}
        />

        {this.props.children}
      </span>
    );
  }
});

const allowed = {accept: true, disabled: true, name: true, required: true, value: true, defaultValue: true, autofocus: true, multiple: true}

function sanitize(props) {
  var res = {}
  for (var i in props) {
    if (allowed[i])
      res[i] = props[i]
  }
  return res
}

export default FileInput;