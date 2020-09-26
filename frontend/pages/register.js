import {useState} from 'react';
import Header from '../template-parts/Header';
const Register = () => {
    

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");


    function submitForm(){
    let formFlag = 0;
    if(fullName == ""){
            console.log("Name cannot be empty");
            formFlag = 1;
        }
        if(fullName.length < 5){
           console.log("Name must be atleast 5 characters");
           formFlag = 1;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){
            console.log("Email not valid");
            formFlag = 1;
        }
        if (password.length < 5){
            console.log("Password must be atleast 5 characters");
            formFlag = 1;
        }
        
        if(formFlag == 1){
            console.log("there is an error");
        }
        else{
            console.log("success");
        }
    }

    return(
        <>
            <Header />
            <div className="register-class">
            <div className="container">
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <input type="text" className="form-control" id="register-name"  placeholder="Your Name"  value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                   
                    
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">Email address</label>
                    <input type="email" className="form-control" id="register-email" placeholder="Enter email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="password" className="form-control" id="register-password" aria-describedby="register-password-help" placeholder="Create a password"   value={password} onChange={(e) => setPass(e.target.value)}/>
                    <small id="register-password-help" className="form-text text-muted d-none">Password should contain atleast 1 uppercase, lowercase and numeric letter</small>
                </div>
                <button type="submit" className="btn btn-primary"  onClick={() => submitForm()}>Submit</button>
            </div>
        </div>
        </>
    )
}

export default Register;