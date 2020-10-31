import ActiveLink from './ActiveLink'
import UserContext from '../functions/context';
import { useEffect,useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Router, useRouter } from 'next/router';

const TopNavbar = (props) => {
  const router = useRouter();


  const { user, logout } = useContext(UserContext);

  const logOut = () => {
    logout();
  }

  

// console.log("oyooooo", user);

  if(user != null){
    
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-forward">
      <a className="navbar-brand" href="#"><img src="../images/logo.png" alt="IOU Logo" className="img-responsive logo-forward"/> Forward Pay</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <ActiveLink activeClassName="active" href="/">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </ActiveLink>
          </li>
          <li className="nav-item">
          <ActiveLink activeClassName="active" href="/favors">
              <a className="nav-link" href="#">Favors</a>
              </ActiveLink>
          </li>
          <li className="nav-item">
          <ActiveLink activeClassName="active" href="/tasks">
              <a className="nav-link" href="#">Tasks</a>
              </ActiveLink>
          </li>
          <li className="nav-item">
            <ActiveLink activeClassName="active" href="/leaderboard">
              <a className="nav-link" href="#">Leaderboard</a>
              </ActiveLink>
          </li>
          <li className="nav-item">
          <ActiveLink activeClassName="active" href="/party">
            <a className="nav-link" href="#">Party</a>
              </ActiveLink>
          </li>
        </ul>
              <Navbar.Text className="text-light mr-4"><i>Logged in as: <b>{user}</b></i></Navbar.Text>
              <button className="btn btn-outline-light mr-sm-2" type="submit" onClick={() => logOut()}>Logout</button>
           
      </div>
      
    </nav>
    
    )
    
  }

  else{
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-forward">
      <a className="navbar-brand" href="#"><img src="../images/logo.png" alt="IOU Logo" className="img-responsive logo-forward"/> Forward Pay</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <ActiveLink activeClassName="active" href="/">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </ActiveLink>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <ActiveLink activeClassName="active" href="/register">
            <a>
              <button className="btn btn-outline-light mr-sm-2" type="submit">Sign Up</button>
            </a>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/login">
            <a>
              <button className="btn btn-light my-2 my-sm-0" type="submit">Sign In</button>
            </a>
          </ActiveLink>
        </form>
      </div>
      
        {/* router.push("/task/dashboard") */}
      
    </nav>
    
    )
  }

    
}

export default TopNavbar;