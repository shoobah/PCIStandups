import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const data = require('./testdata/TestData.json');

ReactDOM.render(<App data={data} startTime={'2015-12-14T09:00'} />, document.getElementById('root'));
