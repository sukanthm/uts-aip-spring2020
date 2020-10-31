import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import Header from '../../template-parts/Header';
import IndividualRewardCard from '../../elements/IndividualRewardCard';
import RewardCard from '../../elements/RewardCard';
import helpers from '../../functions/helpers.js';
import UserContext from '../../functions/context';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const favorId = () => {
    const router = useRouter();
    const favorId = router.query.favorId;
    if (!favorId) return null;
    const { user } = useContext(UserContext);

    //Variables for Claim Modal
    const [showCla, setShowCla] = useState(false);
    const handleCloseCla = () => setShowCla(false);
    const handleShowCla = () => setShowCla(true);
    const [claimDisable, setClaimDisable] = useState(false);

    const [imgFile, setImgFile] = useState("../../../images/upload-img.png");
    const [formImg, setFormImg] = useState();
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
        let result = await fetch(`/api/favor/${favorId}`, {credentials: 'include', method: "GET"});
        let json = await result.json();

        if(json.success == false){
            setErrMsg(json.message);
            setShowAlert(true);
            return;
        } else {
            setFetchSuccess(true);
            setFavorData(json.output);
            setRewardTitle(helpers.rewardTitle(json.output.rewardID));
            setCreationImage(json.output.creationProofPath);
            setCompletionImage(json.output.completionProofPath);
        }
    }

    async function payFavor(){
        const formData = new FormData();
        formData.append('favorID', favorId);
        if(user == favorData.payeeEmail)
            formData.append('proofImage', formImg);
        
        let result = await fetch(`/api/favor/`, {credentials: 'include', method: "PUT", body: formData});
        let json = await result.json();

        if(json.success == true){
            //router.push(`/favor/${favorId}`);
            window.location.reload();
        }
        else {
            setShowCla(false);
            setErrMsg(json.message);
            setShowAlert(true);
        }
    }

    useEffect(()=>{getFavor()}, []);

    return(
        <>
        <Header></Header>
        <div hidden={!fetchSuccess} className="container">      
            <table className="table">
                <thead>
                    <th colSpan="2"><h2>Favor ID: {favorData.id}</h2></th>
                </thead>
                <tbody>
                    <tr>
                        <td>Comment:</td>
                        <td><strong>{favorData.comment}</strong></td>
                    </tr>
                    <tr>
                        <td>Payee Email:</td>
                        <td><strong>{favorData.payeeEmail}</strong></td>
                    </tr>
                    <tr>
                        <td>Payee &rArr; Payer</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Payer Email:</td>
                        <td><strong>{favorData.payerEmail}</strong></td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td><strong>{favorData.status}</strong></td>
                    </tr>
                    <tr>
                        <td>Reward ID:</td>
                        <td><strong>{favorData.rewardID}</strong></td>
                    </tr>
                    <tr>
                        <td>Reward Title:</td>
                        <td><strong>{rewardTitle}</strong><br/><img src={'../../images/reward/'+rewardTitle+'.png'}></img></td>
                    </tr>
                    <tr>
                        <td>Created at:</td>
                        <td><strong>{favorData.createdAt}</strong></td>
                    </tr>
                    <tr hidden={favorData.status == 'Pending'}>
                        <td>Paid at:</td>
                        <td><strong>{favorData.paidAt}</strong></td>
                    </tr>
                    <tr hidden={creationImage==''}>
                        <td>Creation Image:</td>
                        <td><img src={`/api/image/${creationImage}`} alt="creation Image" className="img-size-maintain"></img></td>
                    </tr>
                    <tr hidden={completionImage==''}>
                        <td>Completion Image:</td>
                        <td><img src={`/api/image/${completionImage}`} alt="completion Image" className="img-size-maintain"></img></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
            <Alert.Heading>Oh snap! Error in displaying favor!</Alert.Heading>
                <p>
                    {errMsg}
                </p>
        </Alert>
        
        <div className="col-md-12">
            <button hidden={ favorData.status ? favorData.status === 'Paid' : true} 
                className="btn btn-primary right  btn-forward-main" disabled={claimDisable} onClick={() => setShowCla(true)}>Close favor</button>
        </div>

        {/* Modal for Claim */}
        <Modal show={showCla} onHide={handleCloseCla} dialogClassName="modal-90w" centered>
            <Modal.Header>
                <Modal.Title>Pay this favor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="container-fluid">
                        <div className="row">
                            <div hidden={user == favorData.payerEmail} className="col-md-3 task-image-holder">
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
                <Button variant="secondary" onClick={handleCloseCla}>Cancel</Button>
                <Button variant="primary" onClick={() => payFavor()}>Claim</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
export default favorId;