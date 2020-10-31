import {useState, useEffect, useRef} from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';

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

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //Variables for Modal
    const [showCla, setShowCla] = useState(false);
    const handleCloseCla = () => setShowCla(false);
    const handleShowCla = () => setShowCla(true);

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
        else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
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

    const enterPressed = (e) => {
        console.log("pressa");
        if(e.key === "Enter"){
            validator();
        }
    }

    const submitForm = async () => {
        try{
            let formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('name', fullName);

            let result = await fetch("/api/signup", {method: "POST", 
                credentials: "include", body: formData,
                });
            let json = await result.json();
            

            if (json.success == true){
                handleShowCla();
            }
            else if (json.success == false){
                setValidated(false);
                setErrMsg(json.message);
                setShowAlert(true);
            }
        }
        catch(err){
            console.log(err);
            setValidated(false);
            setErrMsg("Server Error");
            setShowAlert(true);
        }
    }

    const completeTask = async () => {
        router.push('/login');
}

    return(
        <>
            <Header />
            <div className="container party-container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <h2 className="text-center mb-5">Create new account</h2>
                        <div className="form-group">
                            <label htmlFor="register-name">Full Name</label>
                            <input type="text" className="form-control" id="register-name" placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {nameFlag ? <small className="form-text text-danger">Name must be atleast 5 characters</small> : null}


                        </div>
                        <div className="form-group">
                            <label htmlFor="register-email">Email address</label>
                            <input type="email" className="form-control" id="register-email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {emailFlag ? <small className="form-text text-danger">Email not valid</small> : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-password">Password</label>
                            <input type="password" className="form-control" id="register-password" aria-describedby="register-password-help" placeholder="Create a password" value={password} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {passwordFlag ? <small className="form-text text-danger">Password must be atleast 5 characters</small> : null}
                        </div>
                        <br />
                        <button type="submit" className="btn btn-primary btn-lg" onClick={() => validator()}>Sign Up</button>
                        <hr />
                        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Oh snap! Error in registering user!</Alert.Heading>
                            <p>
                                {errMsg}
                            </p>
                        </Alert>
                    </div>
                </div>
            </div>

            {/* Modal for Success Message */}
            <Modal show={showCla} onHide={handleCloseCla}>
                <Modal.Header>
                    <Modal.Title>Account Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        Thank you for creating an Account with us. You can now "Sign In" to start using our wesbite. Thank you.
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => completeTask()}>Sign In</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Register;