import React, { Component } from 'react';
import {Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, form, FormControl, FormGroup, Col, Checkbox, Button } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Request from 'superagent';
import _ from 'lodash';

var user_logged_in = true;

class Gebruiker extends Component {

  constructor(){
    super();
    this.state = {};
  }

  componentWillMount() {
    var url = "http://localhost:3001/api/users/getUsers";
    Request.get(url).then((response) => {
      this.setState({
        users: response.body
      })
    })
  }

  render(){

    var users = _.map(this.state.users, (user) => {
      return <tr><td> {user.id} </td> <td> {user.username} </td> <td> {user.email} </td> <td> <Link to={`./Wijzigen?id=${user.id}`}> Wijzigen </Link> </td>
      <td> Delete </td></tr>;
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

          <Table striped bordered>

            <thead>

              <tr>

                <th> ID </th>
                <th> Username </th>
                <th> Email </th>

              </tr>

            </thead>

            <tbody>

              {users}

            </tbody>

          </Table>

        </div>
    );
  }
}

export default Gebruiker
