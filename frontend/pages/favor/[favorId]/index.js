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
                        <td>Payer Email:</td>
                        <td><strong>{favorData.payerEmail}</strong></td>
                    </tr>
                    <tr>
                        <td>Payee Email:</td>
                        <td><strong>{favorData.payeeEmail}</strong></td>
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
                        <td><strong>{rewardTitle}</strong><br/><img src={'../../images/'+rewardTitle+'.png'}></img></td>
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
            <Alert.Heading>Oh snap! Error in creating task!</Alert.Heading>
                <p>
                    {errMsg}
                </p>
        </Alert>
        </>
    )
}
export default favorId;