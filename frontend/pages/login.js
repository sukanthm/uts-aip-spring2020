import {useState} from 'react';
import Header from '../template-parts/Header';
const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    function submitForm(){
        let formFlag = 0;
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
            <div className="login-page">
                <div className="container">
                    <h2 className="text-center mb-5">Log in to your account</h2>
                    <div className="form-group">
                    <label htmlFor="login-user">Email address</label>
                    <input type="text" className="form-control" id="login-user" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input type="password" className="form-control" id="login-password" placeholder="Password"  value={password} onChange={(e) => setPass(e.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={() => submitForm()}>Submit</button>
                
                </div>
            </div>
      </>
    )
}

export default Login;