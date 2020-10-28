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

    const router = useRouter();
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
    useEffect(()=>{setRadio(isIncoming)}, []);

    function uploadImage(file){
        setShowAlert(false);
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    async function createFavor(){
        setShowAlert(false);
        if (user === null){
            setErrMsg('not logged in');
            setShowAlert(true);
            return;
        }
        if (targetEmail === ''){
            setErrMsg('Please enter Target Email');
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
            router.push(`/favor/${json.newFavorID}`);
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
                        <div className="row">
                            <div className="form-group forward-cust-title">
                                <label htmlFor="task-title">Favor Target Email</label>
                                <input type="text" className="form-control" id="task-title" placeholder="Target Email" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group forward-cust-title">
                                <label htmlFor="radioForm2">Outgoing?</label>
                                <span> </span>
                                <input id='radioForm2' name='radioForm' type="radio" className="reward-num-btn2" onClick={() => setRadio(false)} />
                                <hr/>
                                <label htmlFor="radioForm1">Incoming?</label>
                                <span> </span>
                                <input id='radioForm1' name='radioForm' type="radio" className="reward-num-btn1" onClick={() => setRadio(true)} />
                            </div>
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
            <Button variant="primary" onClick={() => createFavor()}>Submit</Button>
        </div>
    </>
    )
}
export default New;