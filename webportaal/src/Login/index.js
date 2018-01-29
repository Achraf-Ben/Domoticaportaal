import React, { Component } from 'react';
import {FormControl, FormGroup, Button, ControlLabel } from 'react-bootstrap';
import './Login.css';
import request from 'superagent'

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: false
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    var me = this;
    event.preventDefault();
    request
    .post('/api/users/login')
    .send({ email: this.state.email, password: this.state.password })
    .end(function(err, res){
      if(err){
        console.log(err);
      } else {
        me.props.setUser(res.body);
        me.props.history.push('/');
      }
      
    });
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              required
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login
