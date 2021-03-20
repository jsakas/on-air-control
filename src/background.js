console.log('Starting Browser Plugin Boilerplate...');

if (!browser) {
  var browser = chrome;
}

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { saveState, loadState } from './localStorage';


const PluginInterface = ({ initialState }) => {
  const [state, setState] = useState(initialState);
  const { binaryState } = state;

  useEffect(() => {
    saveState(state)
  }, [JSON.stringify(state)])

  const setPartialState = (ns = {}) => {
    setState(state => ({ ...state, ...ns}))
  }

  return (
    <div>
      <h1>Plugin Interface</h1>
      <button onClick={() => setPartialState({ binaryState: 1 - binaryState})}>
        Turn device {binaryState === 0 ? 'on' : 'off'}
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
