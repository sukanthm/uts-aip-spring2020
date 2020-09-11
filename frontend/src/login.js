import React from 'react';
import Navbar from './navbar'

const LoginPage = (props) => {
    return(
        <div className="LogInPage">
        <Navbar></Navbar>
        <div className="container">
          <form className="LogIn-Wrapper">
            <h2 class="text-center mb-5">Log in to your account</h2>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" class="btn btn-primary btn-forward-cstm">Submit</button>
          </form>
          </div>
      </div>
    )
}

export default LoginPage;