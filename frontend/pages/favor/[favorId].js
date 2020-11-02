import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import Header from '../../template-parts/Header';
import helpers from '../../functions/helpers.js';
import UserContext from '../../functions/context';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import LoadingComponent from '../../elements/LoadingComponent';


const favorIdPage = () => {
    const Router = useRouter();
    if (!Router.query.favorId) return null;
    
    let favorId = Router.query.favorId;

    const { user, sessionCheck } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    //Variables for Claim Modal
    const [showClaim, setShowClaim] = useState(false);

    const [imgFile, setImgFile] = useState("/images/upload-img.png");
    const [formImg, setFormImg] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [favorData, setFavorData] = useState({});
    const [rewardTitle, setRewardTitle] = useState('');
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [creationImage, setCreationImage] = useState(false);
    const [completionImage, setCompletionImage] = useState(false);

    function uploadImage(file){
        setShowAlert(false);
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    async function getFavor(){
        setShowClaim(false);
        setShowAlert(false);

        let result = await fetch(`/api/favor/${favorId}`, {credentials: 'include', method: "GET"});
        let json = await result.json();

        if(json.success == false){
            setErrMsg(json.message);
            setIsLoading(false);
            setShowAlert(true);
            return;
        } else {
            setFetchSuccess(true);
            setFavorData(json.output);
            setRewardTitle(helpers.rewardTitle(json.output.rewardID));
            setCreationImage(json.output.creationProofPath);
            setCompletionImage(json.output.completionProofPath);
            setIsLoading(false);
        }
    }

    async function payFavor(){
        const formData = new FormData();
        formData.append('favorID', favorId);

        if(user === favorData.payeeEmail && formImg === ''){
            setShowClaim(false);
            setErrMsg('payee must give image proof to close favor');
            setShowAlert(true);
            return;
        }
        formData.append('proofImage', formImg);
        
        let result = await fetch(`/api/favor/`, {credentials: 'include', method: "PUT", body: formData});
        let json = await result.json();

        if(json.success == true)
            getFavor();
        else {
            setShowClaim(false);
            setErrMsg(json.message);
            setShowAlert(true);
        }
    }

    useEffect(()=>{
        sessionCheck();
        getFavor()
    }, []);

    return(
        <>
        <Header></Header>
        <div className="container">      
            <table className="table">
                <thead>
                    <th colSpan="2"><h2>Favor ID: {favorId}</h2></th>
                </thead>
                
                <div hidden={!isLoading} className="container">
                    <LoadingComponent></LoadingComponent>
                </div>
                
                <tbody hidden={!fetchSuccess}>
                    <tr>
                        <td>Status:</td>
                        <td><h4><strong><span className={"status-"+favorData.status}>{favorData.status}</span></strong></h4></td>
                    </tr>
                    <tr>
                        <td>Payee Email:</td>
                        <td><strong>{favorData.payeeEmail}</strong></td>
                    </tr>
                    <tr>
                        <td>Payee &rArr; Payer</td>
                        <td>&dArr;</td>
                    </tr>
                    <tr>
                        <td>Payer Email:</td>
                        <td><strong>{favorData.payerEmail}</strong></td>
                    </tr>
                    <tr>
                        <td>Reward:</td>
                        <td><strong>{rewardTitle}</strong><br/><img src={'/images/reward/'+rewardTitle+'.png'}></img></td>
                    </tr>
                    <tr>
                        <td>Created at:</td>
                        <td>{helpers.readableDate(favorData.createdAt)}</td>
                    </tr>
                    <tr hidden={favorData.status == 'Pending'}>
                        <td>Paid at:</td>
                        <td>{helpers.readableDate(favorData.paidAt)}</td>
                    </tr>
                    <tr hidden={creationImage==''}>
                        <td>Creation Image:</td>
                        <td><img src={`/api/image/${creationImage}`} alt="creation Image" className="img-size-maintain"></img></td>
                    </tr>
                    <tr hidden={completionImage==''}>
                        <td>Completion Image:</td>
                        <td><img src={`/api/image/${completionImage}`} alt="completion Image" className="img-size-maintain"></img></td>
                    </tr>
                    <tr>
                        <td>Comment:</td>
                        <td>{favorData.comment}</td>
                    </tr>
                </tbody>
            </table>
            
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Oh snap! Error in displaying favor!</Alert.Heading>
                    <p>
                        {errMsg}
                    </p>
            </Alert>
            <button hidden={isLoading} disabled={ favorData.status ? favorData.status === 'Paid' : true} 
                className="btn btn-primary right  btn-forward-main" onClick={() => setShowClaim(true)}>Close favor</button>
        </div>

        {/* Modal for Claim */}
        <Modal show={showClaim} onHide={() => setShowClaim(false)} dialogClassName="modal-90w" centered>
            <Modal.Header>
                <Modal.Title>Pay this favor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <p>You are about to close this favor. Are you sure?</p>
                    <div className="container-fluid">
                        <div className="row">
                            <div hidden={user == favorData.payerEmail} className="col-md-3 task-image-holder">
                                <b>Upload Proof Image</b>
                                <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                                <div className="task-image-upload container-fluid center">
                                    <label htmlFor="task-image-edit">
                                        <h6>Edit Image</h6>
                                    </label>
                                    <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-image-edit"></input>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowClaim(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => payFavor()}>Close Favor</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
export default favorIdPage;