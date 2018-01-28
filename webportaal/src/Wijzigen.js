import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Request from 'superagent';
import _ from 'lodash';

var user_logged_in = true;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class Wijzigen extends Component {

  constructor(){
    super();
    this.state = {};
  }

  componentWillMount() {
    var userid = getParameterByName('id');
    var url = `http://localhost:3001/api/users/getUsersWithID/${userid}`;
    Request.get(url).then((response) => {
      this.setState({
        users: response.body
      })
    })
  }

  render(){

    var users = _.map(this.state.users, (user) => {
      return <Form horizontal>
            <FormGroup>

              <Col sm={12}>
                <FormControl type="text" value={user.id} placeholder="ID:" />
              </Col>

            </FormGroup>
            <FormGroup>

            <Col sm={12}>
              <FormControl type="text" value={user.username} placeholder="Naam:" />
            </Col>

            </FormGroup>
            <FormGroup>

            <Col sm={12}>
              <FormControl type="text" value={user.email} placeholder="Email:" />
            </Col>

            </FormGroup>

            <FormGroup>

              <Col sm={12}>
                <Button type="submit">Opslaan</Button>
                <Button href="./Gebruikers">Back</Button>
              </Col>

            </FormGroup>

          </Form>;
    });

    if (!user_logged_in)
      return (
      <div>

        <Redirect to='./Login'  />

      </div>
    );
    else
    return (
        <div>

          <Col sm={12}>

            {users}

          </Col>

        </div>
    );
  }
}

export default Wijzigen
