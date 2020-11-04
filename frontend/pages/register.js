import {useState, useEffect, useContext} from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';

// Component to Register new users
const Register = () => {

    const { sessionCheck } = useContext(UserContext);
    
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [nameFlag, setNameFlag] = useState(false);
    const [emailFlag, setEmailFlag] = useState(false);
    const [passwordFlag, setPasswordFlag] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    //Variables for Modal
    const [showCla, setShowCla] = useState(false);
    const handleCloseCla = () => setShowCla(false);
    const handleShowCla = () => setShowCla(true);

    useEffect(() => {
        // check if user is loggen in
        if (!sessionCheck('annonymous')) return; //reroutes loggedIn users
    }, []);

    // Function to validate user inputs before submitting
    let validator = () => {
        setShowAlert(false);
        setNameFlag(false);
        setEmailFlag(false);
        setPasswordFlag(false);

        if(fullName.trim().length < 5 || fullName != fullName.replace(/(?![\x00-\x7F])./g, '')){
            setNameFlag(true);
        }
        else if(!/^[\w\d\.]+@[\w\d\.]+\.[\w\d\.]+$/.test(email) || email != email.replace(/(?![\x00-\x7F])./g, '')){ 
            /* 
            allows "s..b@g.com" and others even though they are theoretically illegal
            follow RFC 5322 if you feel fancy (official standard)
            */
            setEmailFlag(true);
        }
        else if(password.trim().length < 5  || password != password.replace(/(?![\x00-\x7F])./g, '')){
            setPasswordFlag(true);
        }
        else{
            setNameFlag(false);
            setEmailFlag(false);
            setPasswordFlag(false);
            submitForm();
            return;
        }
    }

    // Function to detect eneter key press on input boxes
    const enterPressed = (e) => {
        if(e.key === "Enter"){
            validator();
        }
    }

    // Submit values from user 
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
                setErrMsg(json.message);
                setShowAlert(true);
            }
        }
        catch(err){
            console.log(err);
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
                            {nameFlag ? <small className="form-text text-danger">Name must be atleast 5 characters with only ASCII characters</small> : null}


                        </div>
                        <div className="form-group">
                            <label htmlFor="register-email">Email address</label>
                            <input type="email" className="form-control" id="register-email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {emailFlag ? <small className="form-text text-danger">Email not valid (do you have non-ASCII characters?)</small> : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-password">Password</label>
                            <input type="password" className="form-control" id="register-password" aria-describedby="register-password-help" placeholder="Create a password" value={password} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => enterPressed(e)}/>
                            {passwordFlag ? <small className="form-text text-danger">Password must be atleast 5 characters with only ASCII characters</small> : null}
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