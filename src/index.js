import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const data = require('./testdata/TestData.json');

ReactDOM.render( <App data={data}/>, document.getElementById('root'));