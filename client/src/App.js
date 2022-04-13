import React, { Fragment, useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Landing';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Board from './components/pages/Board';
import Alert from './components/other/Alert';
import {Test} from './test';
import useStore from './Store/useStore';
import { Context } from './Store/useStore';

// Redux
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import BoardStore from './contexts/BoardStore';

import './App.css';

if (localStorage.token) setAuthToken(localStorage.token);

const App = () => {
  // const context = useStore(['auth']).store
  // useEffect(() => {context.dispatch(loadUser())}, []);

  return (
    <div>
      <Router>
        <Fragment>
          <Alert/>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <BoardStore>
              <Route exact path='/dashboard' component={Dashboard} />
              <Route exact path='/board/:id' component={Board} />
            </BoardStore>
          </Switch>
        </Fragment>
      </Router>
    </div>
  );
};

export default App;
