import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';

const Login = (props) => {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [emailFlag, setEmailFlag] = useState(false);
    const [passwordFlag, setPasswordFlag] = useState(false);
    const [firstRender, setFirstRender] = useState(0);
    const [validated, setValidated] = useState(false);

    const submitForm = async() => {
        try{
            let userData = {
                email: email,
                password: password
            }
            let result = await fetch("/api/login", {method: "GET", headers: userData});
            let json = await result.json();
            console.log("kya?", json);
            router.push('/');
        }
        catch(err){
            console.log(err);
            setValidated(false);
        }
        }

    useEffect(() => {  // watcher on validated hook variable
        if(firstRender == 0){
            // used to prevent running useEffect on first load
            setFirstRender(firstRender + 1);
            console.log(firstRender);
            return;
        }
        console.log("validated now", validated);
        if(!validated){
            console.log("reenter");
        }
        else{
            // if value of validated is true at any time
            // which should be when user clicks submit and all values a acceptable
            // data will be submitted
            submitForm();
        }
    }, [validated]);

    let validator = () => {
        // function to check if all values are correct
        // will set validated hook variable as false if any value is not acceptable
        console.log("getting in");
        if(email.trim() == ""){
            console.log("Email cannot be empty");
            setEmailFlag(true);
            setValidated(false);
        }
        else if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){
                    console.log("Email not valid");
                    setEmailFlag(true);
                    setValidated(false);
        }
        else if(password.trim() == ""){
            console.log("Password can't be left blank");
            setPasswordFlag(true);
            setValidated(false);
}
        else{
            console.log("elsing");
            setValidated(true);
            setEmailFlag(false);
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
                    {emailFlag ? <small className="form-text text-danger">Email not valid</small> : null}
                    </div>
                    <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input type="password" className="form-control" id="login-password" placeholder="Password"  value={password} onChange={(e) => setPass(e.target.value)}/>
                    {passwordFlag ? <small className="form-text text-danger">Password can't be left blank</small> : null}
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={() => validator()}>Submit</button>
                </div>
            </div>
      </>
    )
}

export default Login;