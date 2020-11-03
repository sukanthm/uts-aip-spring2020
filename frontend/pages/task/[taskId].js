import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import Header from '../../template-parts/Header';
import IndividualRewardCard from '../../elements/IndividualRewardCard';
import RewardCard from '../../elements/RewardCard';
import LoadingComponent from '../../elements/LoadingComponent';
import helpers from '../../functions/helpers.js';
import UserContext from '../../functions/context';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const TaskId = () => {
    const Router = useRouter();
    console.log("jeanpaul", Router.query);
    const taskId = Router.query.taskId;
    if (!taskId) return null;
    const { user, sessionCheck } = useContext(UserContext);

    const [taskImagePath, setTaskImagePath] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [showModalWarning, setShowModalWarning] = useState(false);
    const [taskData, setTaskData] = useState({});
    const [users, setUsers] = useState([]);

    const [claimDisable, setClaimDisable] = useState(false);

    //Variables for Reward Modal
    const [showRew, setShowRew] = useState(false);
    const handleCloseRew = () => setShowRew(false);
    const handleShowRew = () => setShowRew(true);

    //Variables for Claim Modal
    const [showCla, setShowCla] = useState(false);
    const handleCloseCla = () => {setShowCla(false); setShowAlert(false);}
    const handleShowCla = () => {setShowCla(true); setShowAlert(false);}

    //Variables for CLaiming Function
    const [imgFile, setImgFile] = useState("/images/upload-img.png");
    const [taskComment, setTaskComment] = useState('');
    const [formImg, setFormImg] = useState('');

    //Variables for completed tasks
    const [isCompleted, setIsCompleted] = useState(false);


    let claimTask = () => {
        if (claimDisable == false) {

            handleShowCla();
        }
        else {
            setErrMsg("Sponsors of a task couldn't claim it");
            setShowAlert(true);
        }
    }

    let upTaskReward = () => {

        handleShowRew();
    }

    const [rewardJson, setRewardJson] = useState({});

    let rewardData = (category, count) => {
        let id = helpers.rewardID(category); // get id for the selected reward
        let temp_json = rewardJson;
        temp_json[id] = count;
        setRewardJson(temp_json);
        testTaskDeletion();
    }

    const addReward = async () => {
        if (Math.min.apply(null, Object.values(rewardJson)) == 0 &&
            Math.max.apply(null, Object.values(rewardJson)) == 0) {
            handleCloseRew();
            return;
        }

        let rewardFlag = 0;
        let keys = Object.keys(rewardJson);


        try {
            let formData = new FormData();
            formData.append('rewardChanges', JSON.stringify(rewardJson));
            formData.append('requestID', taskId);

            let result = await fetch("/api/request/sponsor", { method: "PUT", body: formData });
            let json = await result.json();

            if (json.success == true) {
                setUsers([]);
                handleCloseRew();
                if (json.deletedRequestID) {
                    setErrMsg(json.message);
                    Router.push(`/deleteTask`);
                }
                else {
                    fetchTaskDetails();
                }
            }
            else if (json.success == false) {
                setErrMsg(json.message);
                setShowAlert(true);
                handleCloseRew();
            }
        }
        catch (err) {

            setErrMsg("Error in updating rewards");
            setShowAlert(true);
            handleCloseRew();
        }

    }

    function uploadImage(file) {
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    const completeTask = async () => {
        if (formImg===''){
            handleCloseCla();
            setErrMsg('image proof is needed to claim a task');
            setShowAlert(true);
            return;
        }
        if (taskComment !== '' && taskComment != taskComment.replace(/(?![\x00-\x7F])./g, '')){
            handleCloseCla();
            setErrMsg('non ASCII characters are illegal in COMMENT, remove to proceed');
            setShowAlert(true);
            return;
        }

        const formData = new FormData();
        formData.append('proofImage', formImg);
        if (taskComment!=='')
            formData.append('completorComment', taskComment);
        formData.append('requestID', taskId);

        try {

            let result = await fetch("/api/request", { credentials: 'include', method: "PUT", body: formData });
            let json = await result.json();

            if (json.success == true) {
                handleCloseCla();
                fetchTaskDetails();
            }
            else if (json.success == false) {
                setErrMsg(json.message);
                setShowAlert(true);
                handleCloseCla();
            }

        }
        catch (err) {
            setErrMsg(err);
            setShowAlert(true);
        }
    }



    const fetchTaskDetails = async () => {
        setClaimDisable(false);
        try {

            let result = await fetch("/api/request/" + taskId, { method: "GET" });
            let json = await result.json();
            if (json.success == true) {

                if (json.output.taskImagePath === '') {
                    setTaskImagePath('/images/no_image.png');
                } else setTaskImagePath(`/api/image/${json.output.taskImagePath}`);

                json.output.createdAt = helpers.readableDate(json.output.createdAt);
                if (json.output.completedAt != null)
                    json.output.completedAt = helpers.readableDate(json.output.completedAt);

                setTaskData(json.output);
                let sponsors = Object.keys(json.output.rewards);
                setUsers(sponsors);
                sponsors.map((userSponsor) => {

                    if (userSponsor == user || taskData.status == "Completed")
                        setClaimDisable(true);

                })

                if (json.output.status == "Completed") {
                    setIsCompleted(true);
                }

                setIsLoading(false);
            }
            else if (json.success == false) {
                setIsLoading(false);
                setErrMsg(json.message);
                setShowAlert(true);

            }

        }
        catch (err) {
            setIsLoading(false);
            setErrMsg("err");
            setShowAlert(true);
        }
    }

    useEffect(() => {
        if (!sessionCheck()) return;
        fetchTaskDetails()
    }, [])
    function testTaskDeletion() {
        setShowModalWarning(false);
        if (taskData.rewards && user in taskData.rewards && Object.keys(taskData.rewards).length === 1) {
            let mapEqualFlag = true;
            for (let rewardID in taskData.rewards[user]) {
                if (taskData.rewards[user][rewardID] != -1 * rewardJson[rewardID]) {
                    mapEqualFlag = false;
                    break;
                }
            }
            if (mapEqualFlag)
                setShowModalWarning('If you proceed, this task will be deleted as no sponsored rewards will be left');
        }
    }
    return (
        <>
            <Header></Header>
            <div hidden={!isLoading} className="container">
                <LoadingComponent></LoadingComponent>
            </div>

            <div hidden={isLoading} className="task-new-class">
                <div className="container">
                    <div className="row">
                        <div hidden={!Object.keys(taskData).length} className="col-md-3 task-image-holder">

                            <img src={taskImagePath} alt="Task Image" className="task-image container"></img>

                        </div>
                        <div hidden={!Object.keys(taskData).length} className="col-md-9">

                            <h2 className="forward-page-header">{taskData.title}</h2>
                            <p>{taskData.description}</p>
                            <p>Created by <strong>{taskData.creatorEmail}</strong> at <i>{(taskData.createdAt)}</i></p>
                            <b>Status:</b> <span className={"status-" + taskData.status}>{taskData.status}</span>

                            {/* show information of completor if the task has been completed */}
                            {/* {showCompletor ? <Completor /> : null} */}

                        </div>
                    </div>
                    <hr hidden={!Object.keys(taskData).length} />

                    <div hidden={!Object.keys(taskData).length} className="row">
                        <div className="col-md-12 contributors">
                            <h4>Sponsors for this Task</h4>
                        </div>
                    </div>
                    <div className="row">
                        {/* {individualUser} */}
                        {
                            users.map((key, i) => {
                                return <IndividualRewardCard user={key} key={i} rewards={taskData.rewards[key]}></IndividualRewardCard>
                            })

                        }
                    </div>
                    <hr hidden={!Object.keys(taskData).length}/>
                    
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)}>
                        <Alert.Heading>Oh snap! Error processing the request!</Alert.Heading>
                        <p>
                            {errMsg}
                        </p>
                    </Alert>

                    <div className="row">

                        {!isCompleted ? (
                            <div hidden={!Object.keys(taskData).length} className="col-md-12">
                                <button className="btn btn-primary right  btn-forward-main" disabled={claimDisable} onClick={() => claimTask()}><FontAwesomeIcon icon={faCheckCircle}/> Claim Task</button>
                                <button className="btn btn-outline-primary mr-3 right btn-forward-main" onClick={() => upTaskReward()}><FontAwesomeIcon icon={faPlusCircle}/>
                                    {
                                        (taskData.rewards && user in taskData.rewards) ? ' Update my rewards' : ' Add rewards'
                                    }
                                </button>
                            </div>
                        ) : (
                                <div className="col-md-12">
                                    <br/>
                                    <table className="table">
                                        <thead>
                                            <h4>Completion Information</h4>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Completed by:</td>
                                                <td><b>{taskData.completorEmail}</b></td>
                                            </tr>
                                            <tr>
                                                <td>Completed at:</td>
                                                <td>{taskData.completedAt}</td>
                                            </tr>
                                            <tr>
                                                <td>Completion Image:</td>
                                                <td><img src={`/api/image/${taskData.completionProofPath}`} alt="completion Image" className="img-size-maintain"></img></td>
                                            </tr>
                                            <tr hidden={!taskData.completorComment}>
                                                <td>Completor Comment:</td>
                                                <td>{taskData.completorComment}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}


                    </div>
                </div>

                {/* Modal for Reward */}
                <Modal show={showRew} onHide={handleCloseRew} dialogClassName="modal-90w" centered>
                    <Modal.Header>
                        <Modal.Title>
                            {
                                (taskData.rewards && user in taskData.rewards) ? 'Update my rewards' : 'Add rewards'
                            }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <div className="row reward-cont">
                                <div className="col-md-2">
                                    <RewardCard img="/images/reward/coffee.png" category="Coffee" amount={rewardData} originalValue={taskData.rewards ? taskData.rewards[user] || 0 : 0}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="/images/reward/meal.png" category="Meal" amount={rewardData} originalValue={taskData.rewards ? taskData.rewards[user] || 0 : 0}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="/images/reward/snacks.png" category="Snacks" amount={rewardData} originalValue={taskData.rewards ? taskData.rewards[user] || 0 : 0}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="/images/reward/candy.png" category="Candy" amount={rewardData} originalValue={taskData.rewards ? taskData.rewards[user] || 0 : 0}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="/images/reward/drink.png" category="Drink" amount={rewardData} originalValue={taskData.rewards ? taskData.rewards[user] || 0 : 0}></RewardCard>
                                </div>
                            </div>
                        </div>
                        <div hidden={!showModalWarning}>
                            <hr />
                            <Alert variant="danger">
                                <Alert.Heading>{showModalWarning}</Alert.Heading>
                            </Alert>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseRew}>Cancel</Button>
                        <Button variant="primary" onClick={() => addReward()}>
                            {
                                (taskData.rewards && user in taskData.rewards) ? 'Update my rewards' : 'Add rewards'
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for Claim */}
                <Modal show={showCla} onHide={handleCloseCla} dialogClassName="modal-90w" centered>
                    <Modal.Header>
                        <Modal.Title>Claim this task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-3 task-image-holder">
                                        <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                                        <div className="task-image-upload container-fluid center">
                                            <label htmlFor="task-image-edit">
                                                <h6>Upload image</h6>
                                            </label>
                                            <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-image-edit"></input>
                                        </div>

                                    </div>
                                    <div className="col-md-9">

                                        <div className="form-group forward-cust-title">
                                            <label htmlFor="task-comment">Task Comment</label>
                                            <textarea className="form-control" id="task-comment" placeholder="Task Comment" rows="5" value={taskComment} onChange={(e) => setTaskComment(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseCla}>Cancel</Button>
                        <Button variant="primary" onClick={() => completeTask()}>Claim</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )


}

export default TaskId;