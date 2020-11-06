import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import Header from '../../template-parts/Header';
import IndividualRewardCard from '../../elements/IndividualRewardCard';
import RewardCard from '../../elements/RewardCard';
import LoadingComponent from '../../elements/LoadingComponent';
import helpers from '../../functions/helpers.js';
import UserContext from '../../functions/context';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
// Component to display data for individual task
const TaskId = () => {
    const Router = useRouter();
    const taskId = Router.query.taskId;

    // Return null if taskID is empty initially
    if (!taskId) return null;
    function test_data_sanity(){ // force all user input to only ASCII
        if (taskId != taskId.replace(/(?![\x00-\x7F])./g, '')){
            Router.push('/task/'+taskId.trim().replace(/(?![\x00-\x7F])./g, ''));
            return false;
        } return true;
    }
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
    const handleCloseCla = () => {setShowCla(false); }
    const handleShowCla = () => {setShowCla(true); }

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

    // Function to update reward data called by child component
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


        try {
            let formData = new FormData();
            formData.append('rewardChanges', JSON.stringify(rewardJson));
            formData.append('requestID', taskId);

            let result = await fetch("/api/request/sponsor", { method: "PUT", body: formData });
            let json = await result.json();

            if (json.success == true) {
                setUsers([]);
                handleCloseRew();
                // Route to Task deleted page if all rewards go nil
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

    // function to upload image and display it on screen
    // Inspired from https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
    function uploadImage(file) {
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
    }

    // Function to claim a task
    const completeTask = async () => {
        // Mandatory image proof for task completion
        if (formImg===''){
            handleCloseCla();
            setErrMsg('image proof is needed to claim a task');
            setShowAlert(true);
            return;
        }
        if (taskComment !== '' && taskComment != taskComment.replace(/(?![\x00-\x7F])./g, '')){
            handleCloseCla();
            setErrMsg('Illegal characters in comment, remove to proceed');
            setShowAlert(true);
            return;
        }

        // Image data sent in form
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


    // Function to fetch details of individual task
    const fetchTaskDetails = async () => {
        setClaimDisable(false);
        try {

            let result = await fetch("/api/request/" + taskId, { method: "GET" });
            let json = await result.json();
            if (json.success == true) {

                // Default task image f none available
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
                    // Disable claiming if current user is a sponsor or task is already completed
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
            setErrMsg(err);
            setShowAlert(true);
        }
    }

    useEffect(() => {
        // Check if user is already logged in
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
        if (!test_data_sanity()) return;
        fetchTaskDetails();
    }, [])

    function testTaskDeletion() {
        setShowModalWarning(false);
        if (taskData.rewards && user in taskData.rewards) {
            let rewardsChangeTo = JSON.parse(JSON.stringify(helpers.emptyRewardsDict)); //deep copy
            for (let rewardID in rewardsChangeTo)
                rewardsChangeTo[rewardID] = (taskData.rewards[user][rewardID] || 0) + (rewardJson[rewardID] || 0);
            
            if ((Object.values(rewardsChangeTo)).reduce((a, b) => a + b, 0) === 0)
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


                        </div>
                    </div>
                    <hr hidden={!Object.keys(taskData).length} />

                    <div hidden={!Object.keys(taskData).length} className="row">
                        <div className="col-md-12 contributors">
                            <h4>Sponsors for this Task</h4>
                        </div>
                    </div>
                    <div className="row">
                        {
                            // Display rewards assosicated with each spaonsor for the task
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
                                        <div className="image-upload container-fluid center">
                                            <label htmlFor="task-completion-image-edit" className="image-upload-label">
                                                <h6>Upload image</h6>
                                            </label>
                                            <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-completion-image-edit"></input>
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