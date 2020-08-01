import React from 'react';
import Nav from './Nav';
import Formular from './Formular';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Administration from './Administration';
import {InitiateIndexedDB} from './InitiateIndexedDB';

import './App.css';

InitiateIndexedDB();

function App() {

  return (
    <div className='app'>
      <Helmet>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </Helmet>
        <Router>
          <Nav />
          <Route path='/Administration' component={Administration} />
          <Route path='/Formular' component={Formular} />
        </Router>
    </div>
  );
}

export default App
