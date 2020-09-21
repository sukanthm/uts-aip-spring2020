import Header from '../template-parts/Header';
const Login = (props) => {
    return(
        <>
            <Header />
            <div className="login-page">
                <div className="container">
                <form className="login-wrapper">
                    <h2 className="text-center mb-5">Log in to your account</h2>
                    <div className="form-group">
                    <label htmlFor="login-user">Email address</label>
                    <input type="text" className="form-control" id="login-user" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input type="password" className="form-control" id="login-password" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
            </div>
      </>
    )
}

export default Login;