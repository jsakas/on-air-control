console.log('Starting Browser Plugin Boilerplate...');

if (!browser) {
  var browser = chrome;
}

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { saveState, loadState } from './localStorage';
import { xml2json } from 'xml-js';
import clsx from 'clsx';

const makeRequest = (state = 0) => `
  <?xml version="1.0" encoding="utf-8"?>
  <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
      <u:SetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">
        <BinaryState>${state}</BinaryState>
      </u:SetBinaryState>
    </s:Body>
  </s:Envelope>
`

const switchBinaryState = (state = 0) => {
  return fetch('http://192.168.0.190:49153/upnp/control/basicevent1', {
    method: 'POST',
    headers: {
      'SOAPACTION': '"urn:Belkin:service:basicevent:1#SetBinaryState"',
      'Content-Type': 'text/xml; charset=utf-8',
    },
    body: makeRequest(state),
  })
    .then(r => r.text())
    .then(xml2json)
    .then(JSON.parse)
}


const PluginInterface = ({ initialState }) => {
  const [state, setState] = useState(initialState);
  const [response, setResponse] = useState({});
  const { binaryState } = state;

  useEffect(() => {
    switchBinaryState(binaryState).then(setResponse);
  }, [binaryState])

  useEffect(() => {
    saveState(state)
  }, [JSON.stringify(state)])

  const setPartialState = (ns = {}) => {
    setState(state => ({ ...state, ...ns }))
  }

  return (
    <div class="wrapper">
      <button
        className={clsx({
          line: true,
          big: true,
          online: binaryState === 1,
          offline: binaryState === 0,
        })}
        onClick={() => setPartialState({ binaryState: 1 - binaryState })}
      >
        {binaryState === 1 ? 'On-Air' : 'Offline'}
      </button>
    </div>
  )
}

PluginInterface.defaultProps = {
  initialState: {},
};

let container = document.getElementById('component');

container && loadState().then(initialState => {
  ReactDOM.render(
    <PluginInterface
      initialState={initialState}
    />
    , container
  );
});
