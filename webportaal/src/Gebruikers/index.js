import React, { Component } from 'react';
import {Table } from 'react-bootstrap';
import request from 'superagent';
import _ from 'lodash';

class Gebruikers extends Component {

  constructor(props){
    super(props);
    this.state = {users:[]}
  }

  componentDidMount(){
    this.getUsers()
  }

  getUsers(){
    var me = this;
    request
    .get('/api/users/')
    .end(function(err, res){
      if(err){
        console.log(err);
        localStorage.removeItem('user');
        me.props.history.push('/');
      } else {
        console.log(res);
        me.setState({users:res.body});
      }
      
    });
  }

  editUser(id){
    
  }

  render() {
    const users = this.state.users.map(user => (
      <tr onClick={() => this.editUser(user.id)} key={user.id}>
        <td>{user.id}</td>
        <td>{user.email}</td>
        <td onClick={() => this.removeUser(user.id)}>X</td>
      </tr>
    ));

    return (
        <Table striped bordered>
          <thead>
            <tr>
              <th> ID </th>
              <th> Email </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {users}
          </tbody>
        </Table>
    );
  }
}

export default Gebruikers
