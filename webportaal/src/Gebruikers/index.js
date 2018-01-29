import React, { Component } from 'react';
import { Table, Modal, Form, FormControl, ControlLabel, Button, ButtonToolbar, FormGroup, Row, Col } from 'react-bootstrap';
import request from 'superagent';

class UserForm extends Component{
  constructor(props){
    console.log(props);
    super(props)
    this.state = {
      id: props.user.id,
      email: props.user.email || "",
      password: '',
      passwordCheck: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  validateForm() {
    let valid = false;

    if(this.state.email.length > 0 && !this.state.password.length){
      valid = true;
    } else if(this.state.email.length && this.state.password.length > 0 && this.state.password == this.state.passwordCheck){
      valid = true;
    }
    return valid;
  }

  saveUser(event){
    event.preventDefault();
    var me = this;
    if(me.state.id){
      request
      .put('/api/users/'+me.state.id)
      .send(me.state)
      .end(function(){
        me.props.closeModal()
      });
    } else {
      console.log('asdf')
      request
      .post('/api/users/')
      .send(me.state)
      .end(function(){
        me.props.closeModal()
      });
    }
  }

  render(){
    return(
      <div className="static-modal">
        <Form onSubmit={this.saveUser.bind(this)}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Gebruiker Bewerken</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            />
          </FormGroup>
          <FormGroup controlId="passwordCheck" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.passwordCheck}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeModal}>Annuleer</Button>
            <Button type="submit" disabled={!this.validateForm()} bsStyle="primary">Opslaan</Button>
          </Modal.Footer>
        </Modal.Dialog>
        </Form>
      </div>
    );
  }
}

const Toolbar = props => (
  <ButtonToolbar>
    <Row>
      <Col xs={4}>
        <Button bsStyle="primary" onClick={() => (props.editUser())}>Nieuwe gebruiker</Button>
      </Col>
      <Col xs={8}></Col>
    </Row>
  </ButtonToolbar>    
);

class Gebruikers extends Component {

  constructor(props){
    super(props);
    this.state = {users:[], openForm:false, user:{}}
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

  closeModal(){
    this.setState({openForm:false, user:{}});
    this.getUsers();
  }

  editUser(id){
    let user = {};
    if(id){
      this.state.users.forEach(function(u){
        if(u.id == id){
          user = u;
        }
      });
    }
    
    this.setState({user: user, openForm:true});
  }

  render() {
    const users = this.state.users.map(user => (
      <tr onClick={() => this.editUser(user.id)} key={user.id}>
        <td>{user.id}</td>
        <td>{user.email}</td>
      </tr>
    ));

    let form = null;
    if(this.state.openForm){
      form = <UserForm closeModal={this.closeModal.bind(this)} user={this.state.user}/>
    }

    return (
      <div>
        {form}
        <Toolbar editUser={this.editUser.bind(this)}/>
        <Table striped bordered>
          <thead>
            <tr>
              <th> ID </th>
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

export default Gebruikers
