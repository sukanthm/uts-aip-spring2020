import {useState, useEffect, useContext} from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';
import UserContext from '../functions/context';
import Alert from 'react-bootstrap/Alert';
import ActiveLink from '../template-parts/ActiveLink';

const Login = (props) => {
    const router = useRouter();
    const { login } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [emailFlag, setEmailFlag] = useState(false);
    const [passwordFlag, setPasswordFlag] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const submitForm = async() => {
        try{
            let userData = {
                email: email,
                password: password
            }
            let result = await fetch("/api/login", {method: "GET", headers: userData});
            let json = await result.json();
            console.log("kya?", json);
            if(json.success == true){
                login(json.email);
                router.push('/');
            }
            else if(json.success == false){
                setErrMsg(json.message);
                setShowAlert(true);
            }
            
        }
        catch(err){
            setErrMsg(err);
            setShowAlert(true);
        }
    }

    const enterPressed = (e) => {
        console.log("pressa");
        if(e.key === "Enter"){
            validator();
        }
    }

    let validator = () => {
        setShowAlert(false);
        setEmailFlag(false);
        setPasswordFlag(false);

        // function to check if all values are correct
        // will set validated hook variable as false if any value is not acceptable
        if(email.trim() == "" || email != email.replace(/(?![\x00-\x7F])./g, '')){
            setEmailFlag(true);
        }
        else if(password.trim() == "" || password != password.replace(/(?![\x00-\x7F])./g, '')){
            setPasswordFlag(true);
        }
        else{
            submitForm();
            return;
        }
    }

    return(
        <>
            <Header />
            <div className="container party-container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h2 className="text-center mb-5">Log in to your account</h2>
                        <div className="form-group">
                            <label htmlFor="login-user">Email address</label>
                            <input type="text" className="form-control" id="login-user" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {emailFlag ? <small className="form-text text-danger">Email not valid (do you have non-ASCII characters?)</small> : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input type="password" className="form-control" id="login-password" placeholder="Password"  value={password} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {passwordFlag ? <small className="form-text text-danger">Password not valid (do you have non-ASCII characters?)</small> : null}
                        </div>
                        <br />
                        <button type="submit" className="btn btn-primary btn-lg" onClick={() => validator()}>Log In</button>
                        <hr />

                        <p>Don't have an account yet? <ActiveLink activeClassName="active" href="/register"><a>Sign Up</a></ActiveLink>
                        </p>
                        <hr />
                        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Oh snap! Error in authenticating user!</Alert.Heading>
                            <p>
                                {errMsg}
                            </p>
                        </Alert>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;