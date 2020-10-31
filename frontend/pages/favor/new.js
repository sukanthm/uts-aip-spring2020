import { Button, ButtonToolbar } from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import UserContext from '../../functions/context';
import Header from '../../template-parts/Header';
import RewardCard from '../../elements/RewardCard';
import AllRewardsRadio from '../../elements/AllRewardsRadio';
import helpers from '../../functions/helpers.js';
import Alert from 'react-bootstrap/Alert';
import { useRouter } from 'next/router';

const New = () => {

    const Router = useRouter();
    const { user, logout } = useContext(UserContext);

    const [imgFile, setImgFile] = useState("../../images/upload-img.png");
    const [formImg, setFormImg] = useState("");

    const [targetEmail, setTargetEmail] = useState("");
    const [isIncoming, setIsIncoming] = useState(false);
    const [rewardID, setrewardID] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    function setRadio(radioFlag){
        setShowAlert(false);
        setIsIncoming(radioFlag);
        document.getElementById('radioForm1').checked = radioFlag;
        document.getElementById('radioForm2').checked = !radioFlag;
    }
    useEffect(()=>{
        if(!helpers.checkCookie()){
            Router.push("/");
        }
        setRadio(isIncoming)}, [targetEmail]);

    function uploadImage(file){
        setShowAlert(false);
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    async function createFavor(){
        setShowAlert(false);
        if (targetEmail === ''){
            setErrMsg('Please enter Target Email');
            setShowAlert(true);
            return;
        }
        if (rewardID === ''){
            setErrMsg('Please select a reward');
            setShowAlert(true);
            return;
        }

        const formData = new FormData();
        formData.append('rewardID', rewardID);
        if (isIncoming){
            formData.append('payeeEmail', targetEmail);
            formData.append('payerEmail', user);
            formData.append('proofImage', formImg);
        } else {
            formData.append('payeeEmail', user);
            formData.append('payerEmail', targetEmail);
        }
        let result = await fetch("/api/favor", {credentials: 'include', method: "POST", body: formData});
        let json = await result.json();

        if(json.success == true)
            Router.push(`/favor/${json.newFavorID}`);
        else {
            setErrMsg(json.message);
            setShowAlert(true);
        }
    }

    return( 
    <>
        <Header></Header>
        <div className="container">
                <h3 className="forward-page-header">Create New Favor</h3>
                <hr/>
                <div className="row">

                    <div className="col-md-9">
                            <div className="form-group forward-cust-title">
                                <label htmlFor="task-title">Type the Email you want to create this favor for:</label>
                                <input type="text" className="form-control" id="task-title" placeholder="Favor Target Email" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}/>
                            </div>
                            <br/>
                            <br/>
                            <div className="form-group">
                                {/* <p htmlFor="task-title" className="forward-cust-title">Is this email payer or payee?</p> */}
                                <input id='radioForm2' name='radioForm' type="radio" className="reward-num-btn2" onClick={() => setRadio(false)} />
                                <span> </span>
                                <label htmlFor="radioForm2">I owe <b>{targetEmail || 'them'}</b></label>
                                <hr/>
                                <input id='radioForm1' name='radioForm' type="radio" className="reward-num-btn1" onClick={() => setRadio(true)} />
                                <span> </span>
                                <label htmlFor="radioForm1"><b>{targetEmail || 'they'}</b> owe{targetEmail?'s':''} me</label>
                            </div>
                    </div>

                    <div hidden={!isIncoming} className="col-md-3 task-image-holder">                        
                        <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                        <div className="task-image-upload container center">
                            <label htmlFor="task-image-edit">
                                Add / Edit Image
                            </label>
                            <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-image-edit"></input>
                        </div>
                    </div>

                </div>
            </div>
        <hr/>
        <div className="container text-center">
            <h4 className="mb-5">Choose the Reward for this favor</h4>
            <AllRewardsRadio id={(id) => {setrewardID(id)}}></AllRewardsRadio>
            <hr/>
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Oh snap! Error in creating task!</Alert.Heading>
                    <p>
                        {errMsg}
                    </p>
            </Alert>
            <button className="btn btn-primary mr-3 right btn-forward-main" onClick={() => createFavor()}>Create New Favor</button>
        </div>
    </>
    )
}
export default New;