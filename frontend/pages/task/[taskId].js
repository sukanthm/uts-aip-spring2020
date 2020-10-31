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

const TaskId = () => {
    const router = useRouter();
    console.log("jeanpaul", router.query);
    const taskId = router.query.taskId;
    if (!taskId) return null;
    const { user } = useContext(UserContext);

    // const cookie = decodeURIComponent(document.cookie).substring(7);
    const userMail = user;

    console.log("mailo", userMail);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [taskData, setTaskData] = useState({});
    const [users, setUsers] = useState([]);

    const [claimDisable, setClaimDisable] = useState(false);

    //Variables for Reward Modal
    const [showRew, setShowRew] = useState(false);
    const handleCloseRew = () => setShowRew(false);
    const handleShowRew = () => setShowRew(true);

    //Variables for Claim Modal
    const [showCla, setShowCla] = useState(false);
    const handleCloseCla = () => setShowCla(false);
    const handleShowCla = () => setShowCla(true);

    //Variables for CLaiming Function
    const [imgFile, setImgFile] = useState("../../../images/upload-img.png");
    const [taskComment, setTaskComment] = useState();
    const [formImg, setFormImg] = useState();

    //Variables for completed tasks
    const [isCompleted, setIsCompleted] = useState(false);
    

    let claimTask = () => {
        if (claimDisable == false) {
            //console.log(router.query);
            //router.push(`/task/${taskId}/claim`);
            handleShowCla();
        }
        else {
            setErrMsg("Sponsors of a task couldn't claim it");
            setShowAlert(true);
        }
    }

    let upTaskReward = () => {
        console.log("Upping it!");
        handleShowRew();
    }

    let rewardJson = {};

    let rewardData = (category, count) => {
        let id = helpers.rewardID(category); // fetch id for the selected reward
        rewardJson[id] = count;
    }

    const addReward = async () => {
        console.log(rewardJson);

        let rewardFlag = 0;
        let keys = Object.keys(rewardJson);
        // Check if rewards have not been left empty
        // keys.map((key) => {
        //     if (rewardJson[key] > 0) {
        //         rewardFlag = 1;
        //     }
        // })

        // if (rewardFlag == 0) {
        //     setErrMsg("No rewards added!");
        //     handleCloseRew();
        //     setShowAlert(true);
        //     return;
        // }

        try {
            let formData = new FormData();
            formData.append('rewardChanges', JSON.stringify(rewardJson));
            formData.append('requestID', taskId);

            let result = await fetch("/api/request/sponsor", { method: "PUT", body: formData });
            let json = await result.json();
            console.log("kya?", json);
            if (json.success == true) {
                handleCloseRew();
                if(json.deletedRequestID){
                    setErrMsg(json.message);
                    router.push(`/deleteTask`);
                }
                else{
                    fetchTaskDetails();
                }
            }
            else if(json.success == false){
                setErrMsg(json.message);
                setShowAlert(true);
                handleCloseRew();
            }
        }
        catch (err) {
            console.log(err);
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
        console.log(imgFile);
        console.log(taskComment);
        const formData = new FormData();
        formData.append('proofImage', formImg);
        formData.append('completorComment', taskComment);
        formData.append('requestID', taskId);

        try {

            let result = await fetch("/api/request", { credentials: 'include', method: "PUT", body: formData });
            let json = await result.json();
            console.log("kya?", json);
            if (json.success == true) {
                handleCloseCla();
                fetchTaskDetails();
            }
            else if(json.success == false){
                setErrMsg(json.message);
                setShowAlert(true);
                handleCloseCla();
            }
            
        }
        catch (err) {
            console.log(err);

        }
    }

    

    const fetchTaskDetails = async () => {
        try {
            // let fetchJson = {
            //     loginToken: "$2b$10$hcT7aC5xrGVVBPhwtjQWBOQWPnXvr4OIRm9A1AcOOGfAPJJeY6PCa",
            //     requestId: taskId
            // }
            let result = await fetch("/api/request/" + taskId, { method: "GET" });
            let json = await result.json();
            if(json.success == true){
                json.output.createdAt = helpers.readableDate(json.output.createdAt);
                if(json.output.completedAt != null)
                    json.output.completedAt = helpers.readableDate(json.output.completedAt);
                console.log("kya?", json);
                setTaskData(json.output);
                let sponsors = Object.keys(json.output.rewards);
                setUsers(sponsors);
                sponsors.map((user) => {
                    console.log("ujer", user);

                    if (user == userMail || taskData.status == "Completed")
                        setClaimDisable(true);

                })
                
                if(json.output.status == "Completed"){
                    setIsCompleted(true);
                }
            }
            else if(json.success == false){
                setErrMsg(json.message);
                setShowAlert(true);
            }

        }
        catch (err) {
            console.log(err);
            setErrMsg("Server Error");
            setShowAlert(true);
        }
    }

    useEffect(() => { fetchTaskDetails() }, [])

    // useEffect(() => { console.log("We are testing here:", showCompletor) }, [showCompletor])

    // const Completor = () => (
    //     <div>
    //         <p>Completed by <strong>{taskData.completorEmail}</strong> at <i>{(taskData.completedAt)}</i></p>
    //     </div>
    // )


    return (
        <>
            <Header></Header>
            <div className="task-new-class">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 task-image-holder">

                            <img src={`/api/image/${taskData.taskImagePath}`} alt="Task Image" className="task-image container"></img>

                        </div>
                        <div className="col-md-9">

                            <h2 className="forward-page-header">{taskData.title}</h2>
                            <p>{taskData.description}</p>
                            <p>Created by <strong>{taskData.creatorEmail}</strong> at <i>{(taskData.createdAt)}</i></p>
                            <b>Status:</b> <span className={"status-"+taskData.status}>{taskData.status}</span>

                            {/* show information of completor if the task has been completed */}
                            {/* {showCompletor ? <Completor /> : null} */}

                        </div>
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col-md-12 contributors">
                            <h4>Contributors for this Task</h4>
                        </div>
                    </div>
                    <div className="row">
                        {/* {individualUser} */}
                        {
                            users.map((key,i) => {
                                console.log("albela", key);
                                return <IndividualRewardCard user={key} key={i} rewards={taskData.rewards[key]}></IndividualRewardCard>
                            })

                        }

                    </div>
                    <hr />
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Oh snap! Error processing the request!</Alert.Heading>
                        <p>
                            {errMsg}
                        </p>
                    </Alert>

                    <div className="row">

                        {!isCompleted ? (
                            <div className="col-md-12">
                                <button className="btn btn-primary right  btn-forward-main" disabled={claimDisable} onClick={() => claimTask()}>Claim Task</button>
                                <button className="btn btn-outline-primary mr-3 right btn-forward-main" onClick={() => upTaskReward()}>Update Reward Task</button>
                            </div>
                        ) : (
                            <div className="col-md-12">
                                    <p><b>Completed by </b>{taskData.completorEmail} at {taskData.completedAt}</p>
                            </div>
                        )}
                        

                    </div>
                </div>

                {/* Modal for Reward */}
                <Modal show={showRew} onHide={handleCloseRew} dialogClassName="modal-90w" centered>
                    <Modal.Header>
                        <Modal.Title>Choose rewards you want to add to this task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container text-center">
                            <div className="row reward-cont">
                                <div className="col-md-2">
                                    <RewardCard img="../../../images/reward/coffee.png" category="Coffee" amount={rewardData}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="../../../images/reward/candy.png" category="Candy" amount={rewardData}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="../../../images/reward/meal.png" category="Meal" amount={rewardData}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="../../../images/reward/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                                </div>
                                <div className="col-md-2">
                                    <RewardCard img="../../../images/reward/drink.png" category="Drink" amount={rewardData}></RewardCard>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseRew}>Cancel</Button>
                        <Button variant="primary" onClick={() => addReward()}>Update Reward</Button>
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
                                                <h6>Edit Image</h6>
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
                                {/* <button className="btn btn-primary right" onClick={() => completeTask()}>Task Completed</button> */}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCla}>Cancel</Button>
                        <Button variant="primary" onClick={() => completeTask()}>Claim</Button>
                    </Modal.Footer>
                </Modal>



            </div>

        </>
    )


}

export default TaskId;