import {useState, useEffect, useRef} from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router'

const Register = () => {
    
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [nameFlag, setNameFlag] = useState(false);
    const [emailFlag, setEmailFlag] = useState(false);
    const [passwordFlag, setPasswordFlag] = useState(false);

    const [firstRender, setFirstRender] = useState(0);
    const [validated, setValidated] = useState(false);

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
        if(fullName.trim() == ""){
            console.log("Name cannot be empty");
            setNameFlag(true);
            setValidated(false);
        }
        else if(fullName.trim().length < 5){
            console.log("Name must be atleast 5 characters");
            setNameFlag(true);
            setValidated(false);
        }
        else if(email.trim() == ""){
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
            console.log("Password must be atleast 5 characters");
            setPasswordFlag(true);
            setValidated(false);
        }
        else if(password.trim().length < 5){
            console.log("Password must be atleast 5 characters");
            setPasswordFlag(true);
            setValidated(false);
        }
        else{
            console.log("elsing");
            setValidated(true);
            setNameFlag(false);
            setEmailFlag(false);
            setPasswordFlag(false);
        }
    }

    const submitForm = async () => {
        try{
        console.log(fullName);
        console.log(email);
        console.log(password);

        let userData = {
            email: email,
            password: password,
            name: fullName
        }
        let result = await fetch("/api/signup", {method: "POST", headers: userData, credentials: "include"});
        let json = await result.json();
        console.log("kya?", json);
        router.push('/login');
    }
    catch(err){
        console.log(err);
        setValidated(false);
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
                    {nameFlag ? <small className="form-text text-danger">Name must be atleast 5 characters</small> : null}
                    
                    
                </div>
                <div className="form-group">
                    <label htmlFor="register-email">Email address</label>
                    <input type="email" className="form-control" id="register-email" placeholder="Enter email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
                    {emailFlag ? <small className="form-text text-danger">Email not valid</small> : null}
                </div>
                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="password" className="form-control" id="register-password" aria-describedby="register-password-help" placeholder="Create a password"   value={password} onChange={(e) => setPass(e.target.value)}/>
                    {passwordFlag ? <small className="form-text text-danger">Password must be atleast 5 characters</small> : null}
                </div>
                <button type="submit" className="btn btn-primary"  onClick={() => validator()}>Submit</button>
            </div>
        </div>
        </>
    )
}

export default Register;