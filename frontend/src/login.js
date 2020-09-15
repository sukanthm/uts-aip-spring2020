import React from 'react';
import Navbar from './navbar'

const LoginPage = (props) => {
    return(
        <div className="login-page">
        <Navbar></Navbar>
        <div className="container">
          <form className="login-wrapper">
            <h2 class="text-center mb-5">Log in to your account</h2>
            <div class="form-group">
              <label for="login-user">Email address</label>
              <input type="text" class="form-control" id="login-user" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" class="form-control" id="login-password" placeholder="Password" />
            </div>
            <button type="submit" class="btn btn-primary btn-forward-cstm">Submit</button>
          </form>
          </div>
      </div>
    )
}

export default LoginPage;