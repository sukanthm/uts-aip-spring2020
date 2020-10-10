import ActiveLink from './ActiveLink'

const TopNavbar = (props) => {
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
            <a className="nav-link" href="#">Favours</a>
          </li>
          <li className="nav-item">
          <ActiveLink activeClassName="active" href="/task/dashboard">
              <a className="nav-link" href="#">Tasks</a>
              </ActiveLink>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Leaderboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Party</a>
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
    </nav>
    )
}

export default TopNavbar;