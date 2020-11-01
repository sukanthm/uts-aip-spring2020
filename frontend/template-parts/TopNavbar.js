import ActiveLink from './ActiveLink'
import UserContext from '../functions/context';
import { useEffect, useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';

const TopNavbar = (props) => {
  const { user, logout } = useContext(UserContext);
  const isLoggedIn = user != null;
  const logOut = () => {
    logout();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-forward">
      <a className="navbar-brand" href="/">
        <img style={{ cursor: 'default' }} src="../images/logo.png" alt="IOU Logo" className="img-responsive logo-forward" />
        Forward Pay
      </a>
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
          <li hidden={!isLoggedIn} className="nav-item">
            <ActiveLink activeClassName="active" href="/favors">
              <a className="nav-link" href="#">Favors</a>
            </ActiveLink>
          </li>
          <li hidden={!isLoggedIn} className="nav-item">
            <ActiveLink activeClassName="active" href="/tasks">
              <a className="nav-link" href="#">Tasks</a>
            </ActiveLink>
          </li>
          <li hidden={!isLoggedIn} className="nav-item">
            <ActiveLink activeClassName="active" href="/leaderboard">
              <a className="nav-link" href="#">Leaderboard</a>
            </ActiveLink>
          </li>
          <li hidden={!isLoggedIn} className="nav-item">
            <ActiveLink activeClassName="active" href="/party">
              <a className="nav-link" href="#">Party</a>
            </ActiveLink>
          </li>
          <li className="nav-item">
            <ActiveLink activeClassName="active" href="/help">
              <a className="nav-link" href="#">HELP</a>
            </ActiveLink>
          </li>
        </ul>

        <form hidden={isLoggedIn} className="form-inline my-2 my-lg-0">
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

        <div hidden={!isLoggedIn}>
          <Navbar.Text className="text-light mr-4"><i>Logged in as: <b>{user}</b></i></Navbar.Text>
          <button className="btn btn-outline-light mr-sm-2" type="submit" onClick={() => logOut()}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar;