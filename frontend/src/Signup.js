import React from 'react';




const Signup = () => {
    return(
        <div>
                <h2>Signup</h2>
                <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <input type="email" className="form-control" id="register-name"  placeholder="Your Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">Email address</label>
                    <input type="email" className="form-control" id="register-email" placeholder="Enter email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="email" className="form-control" id="register-password" aria-describedby="register-password-help" placeholder="Create a password"/>
                    <small id="register-password-help" className="form-text text-muted d-none">Password should contain atleast 1 uppercase, lowercase and numeric letter</small>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
    )
}

export default Signup;