import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import Header from '../../../template-parts/Header';
import IndividualRewardCard from '../../../elements/IndividualRewardCard';
import RewardCard from '../../../elements/RewardCard';
import helpers from '../../../functions/helpers.js';
import UserContext from '../../../functions/context';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const favorId = () => {
    const router = useRouter();
    const favorId = router.query.favorId;
    if (!favorId) return null;
    const { user } = useContext(UserContext);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [favorData, setFavorData] = useState({});
    const [rewardTitle, setRewardTitle] = useState('');
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [creationImage, setCreationImage] = useState(false);
    const [completionImage, setCompletionImage] = useState(false);

    async function getFavor(){
        setShowAlert(false);
        if (user === null){
            setErrMsg('not logged in');
            setShowAlert(true);
            return;
        }

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

    useEffect(()=>{getFavor()}, []);

    return(
        <>
        <Header></Header>
        <div hidden={!fetchSuccess} className="container">      

            <div className="row">
            <div className="col-md-9">
                <h2 className="forward-page-header">Favor ID: {favorData.id}</h2>
                <p>Comment: <strong>{favorData.comment}</strong></p>
                <p>Payer Email: <strong>{favorData.payerEmail}</strong></p>
                <p>Payee Email: <strong>{favorData.payeeEmail}</strong></p>
                <b>Status: </b> <span className={"status-"+favorData.status}>{favorData.status}</span>
                <p>Reward ID: <strong>{favorData.rewardID}</strong></p> 
                <p>Reward Title: <strong>{rewardTitle}</strong></p> 
                <img src={'../../images/'+rewardTitle+'.png'} className="col-lg-12"></img>
                {/* resize image */}
                <p>Created at: <strong>{favorData.createdAt}</strong></p>
                <p hidden={favorData.status == 'Pending'}>Paid at: <strong>{favorData.paidAt}</strong></p>
            </div>
            </div>

            <div hidden={creationImage==''} className="col-md-3 task-image-holder">                        
                <img src={`/api/image/${creationImage}`} alt="creation Image" className="task-image container"></img>
                <div className="task-image-upload container center">
                    <label>Creation Image</label>
                </div>
            </div>

            <div hidden={completionImage==''} className="col-md-3 task-image-holder">                        
                <img src={`/api/image/${completionImage}`} alt="completion Image" className="task-image container"></img>
                <div className="task-image-upload container center">
                    <label>Completion Image</label>
                </div>
            </div>
        </div>
        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
            <Alert.Heading>Oh snap! Error in creating task!</Alert.Heading>
                <p>
                    {errMsg}
                </p>
        </Alert>
        </>
    )
}
export default favorId;