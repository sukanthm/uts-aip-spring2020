import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import LoginPage from './login'
import './App.css';
import './ForwardPay.css';

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
      <LoginPage></LoginPage>
    );
  }
}

export default login;
