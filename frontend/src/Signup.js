import React from 'react';




const Signup = () => {
    return(
        <div>
                <h2>Signup</h2>
                <div className="form-group">
                    <label htmlFor="signUpName">Full Name</label>
                    <input type="email" className="form-control" id="signUpName"  placeholder="Your Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="signUpMail">Email address</label>
                    <input type="email" className="form-control" id="signUpMail" aria-describedby="signUpEmailHelp" placeholder="Enter email"/>
                    <small id="signUpEmailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="signUpPassword">Password</label>
                    <input type="email" className="form-control" id="signUpPassword" aria-describedby="signUpPasswordHelp" placeholder="Your secret code"/>
                    <small id="signUpPasswordHelp" className="form-text text-muted">Password should contain atleast 1 uppercase, lowercase and numeric letter</small>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
    )
}

export default Signup;