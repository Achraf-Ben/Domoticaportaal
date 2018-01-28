import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import './App.css';
import Gebruikers from './Gebruikers';
import Modules from './Modules';
import EnkeleModuleOverzicht from './Enkelemodule';
import NavbarMenu from './NavbarMenu';
import Login from './Login';
import GebruikersAanmaken from './GebruikersAanmaken';
import Alarmmelding from './Alarmmelding';
import Wijzigen from './Wijzigen';
import Test from './Test';

var user_logged_in = true;

class App extends Component {
  render() {
    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

        <NavbarMenu />

        <Route exact path='/Gebruikers' component={Gebruikers} />
        <Route exact path='/Modules' component={Modules} />
        <Route exact path='/Enkelemodule' component={EnkeleModuleOverzicht} />
        <Route exact path='/Wijzigen' component={Wijzigen} />
        <Route exact path='/Login' component={Login} />
        <Route exact path='/GebruikersAanmaken' component={GebruikersAanmaken} />
        <Route exact path='/Alarmmelding' component={Alarmmelding} />
        <Route exact path='/Test' component={Test} />

      </div>
    );
    else
    return (
      <div>

        <NavbarMenu />

        <Route exact path='/Gebruikers' component={Gebruikers} />
        <Route exact path='/Modules' component={Modules} />
        <Route exact path='/Enkelemodule' component={EnkeleModuleOverzicht} />
        <Route exact path='/Wijzigen' component={Wijzigen} />
        <Route exact path='/Login' component={Login} />
        <Route exact path='/GebruikersAanmaken' component={GebruikersAanmaken} />
        <Route exact path='/Alarmmelding' component={Alarmmelding} />
        <Route exact path='/Test' component={Test} />

      </div>

    );
  }
}

export default App;
