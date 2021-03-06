import { useState, useEffect, useContext } from 'react';
import UserContext from '../../functions/context';
import Header from '../../template-parts/Header';
import AllRewardsRadio from '../../elements/AllRewardsRadio';
import Alert from 'react-bootstrap/Alert';
import { useRouter } from 'next/router';

// Page to create a new favor
const New = () => {

    const Router = useRouter();
    const { user, sessionCheck } = useContext(UserContext);

    const [imgFile, setImgFile] = useState("/images/upload-img.png");
    const [formImg, setFormImg] = useState("");

    const [targetEmail, setTargetEmail] = useState("");
    const [isIncoming, setIsIncoming] = useState(false);
    const [rewardID, setrewardID] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [sessionCheckValue, setSessionCheckValue] = useState(false);
    let sessionCheckValueCopy = false;

    function setRadio(radioFlag) {
        setShowAlert(false);
        setIsIncoming(radioFlag);
        document.getElementById('radioForm1').checked = radioFlag;
        document.getElementById('radioForm2').checked = !radioFlag;
    }

    useEffect(() => {
        sessionCheckValueCopy = sessionCheck('loggedIn'); //for instant js validation
        setSessionCheckValue(sessionCheckValueCopy); //for html update (as hooks update async)
        if (!sessionCheckValueCopy) return; //reroutes annonymous users
    }, []);

    function uploadImage(file) {
        setShowAlert(false);
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    async function createFavor() {
        try {
            setShowAlert(false);
            if (targetEmail === '') {
                setErrMsg('Please enter Target Email');
                setShowAlert(true);
                return;
            }
            if (rewardID === '') {
                setErrMsg('Please select a reward');
                setShowAlert(true);
                return;
            }
            if (isIncoming && formImg === '') {
                setErrMsg('proof required if target is to owe you');
                setShowAlert(true);
                return;
            }
            if (targetEmail != targetEmail.replace(/(?![\x00-\x7F])./g, '')) {
                setErrMsg('Illegal non-ASCII characters used in email, remove to proceed');
                setShowAlert(true);
                return;
            }

            const formData = new FormData();
            formData.append('rewardID', rewardID);
            if (isIncoming) {
                formData.append('payeeEmail', targetEmail);
                formData.append('payerEmail', user);
                formData.append('proofImage', formImg);
            } else {
                formData.append('payeeEmail', user);
                formData.append('payerEmail', targetEmail);
            }
            let result = await fetch("/api/favor", { credentials: 'include', method: "POST", body: formData });
            let json = await result.json();

            if (json.success == true)
                Router.push(`/favor/${json.newFavorID}`);
            else {
                setErrMsg(json.message);
                setShowAlert(true);
            }
        } catch (err) {
            setErrMsg(err);
            setShowAlert(true);
        }
    }

    return (
        <>
            <Header></Header>
            {sessionCheckValue ? ()=>{setRadio(isIncoming)} : ()=>{}}
            {sessionCheckValue ?
                <>
                    <div className="container">
                        <h3 className="forward-page-header">Create New Favor</h3>
                        <hr />
                        <div className="row">

                            <div className="col-md-9">
                                <div className="form-group forward-cust-title">
                                    <label htmlFor="task-title">Type the Email you want to create this favor for:</label>
                                    <input type="text" className="form-control" id="task-title" placeholder="Favor Target Email" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} />
                                </div>
                                <br />
                                <br />
                                <div className="form-group">
                                    <input id='radioForm2' name='radioForm' type="radio" className="reward-num-btn2" onClick={() => setRadio(false)} />
                                    <span> </span>
                                    <label htmlFor="radioForm2">I owe <b>{targetEmail || 'them'}</b></label>
                                    <hr />
                                    <input id='radioForm1' name='radioForm' type="radio" className="reward-num-btn1" onClick={() => setRadio(true)} />
                                    <span> </span>
                                    <label htmlFor="radioForm1"><b>{targetEmail || 'they'}</b> owe{targetEmail ? 's' : ''} me</label>
                                </div>
                            </div>

                            <div hidden={!isIncoming} className="col-md-3 task-image-holder">
                                <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                                <div className="image-upload container center">
                                    <label htmlFor="favor-image-edit" className="image-upload-label">
                                        Upload Image
                            </label>
                                    <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="favor-image-edit"></input>
                                </div>
                            </div>

                        </div>
                    </div>
                    <hr />
                    <div className="container text-center">
                        <h4 className="mb-5">Choose the Reward for this favor</h4>
                        <AllRewardsRadio id={(id) => { setrewardID(id); setShowAlert(false);; }}></AllRewardsRadio>
                        <hr />
                        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                            <Alert.Heading>Oh snap! Error in creating task!</Alert.Heading>
                            <p>
                                {errMsg}
                            </p>
                        </Alert>
                        <button className="btn btn-primary mr-3 right btn-forward-main" onClick={() => createFavor()}>Create New Favor</button>
                    </div>
                </>
            : <></>}
        </>
    )
}
export default New;