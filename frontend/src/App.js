import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import LoginPage from './login'
import './ForwardPay.css';
import './App.css';
import Signup from './Signup';





class login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      // <LoginPage></LoginPage>
      <Signup></Signup>
    );

  }
}

export default login;
