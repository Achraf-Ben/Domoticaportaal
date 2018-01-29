import React, { Component } from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';
import Gebruikers from './Gebruikers/';
import Modules from './Modules/';
import NavbarMenu from './NavbarMenu';
import Login from './Login/';
import './App.css';

function withProps(Component, props) {
    return function(matchProps) {
      return <Component {...props} {...matchProps} />
    }
  }

const Main = (props) => (
  <div>
    <NavbarMenu />
    <Switch>   
      <Route exact path='/gebruikers' component={Gebruikers} />
      <Route exact path='/modules' component={Modules} />
      <Redirect from="/" to="/modules" />
    </Switch>
  </div>
)

const LoginMain = (props) => (
  <Switch>
    <Route path='/login' component={withProps(Login, {setUser:props.setUser})} />          
    <Redirect push to={"/login"} />
  </Switch>
)


class App extends Component {

  constructor(props){
    super(props);

    var user = JSON.parse(localStorage.getItem('user'));
    this.state = {user:user}
  }

  setUser(user){
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({'user':user});
  }  

  render() {
    let view = this.state.user ? <Main /> : <LoginMain setUser={this.setUser.bind(this)} />;

    return (
      <div>
        { view }
      </div>
    );
  }
}

export default App;
