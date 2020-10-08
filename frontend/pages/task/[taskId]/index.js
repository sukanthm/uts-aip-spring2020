import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import Header from '../../../template-parts/Header';
import IndividualRewardCard from '../../../elements/IndividualRewardCard';
import RewardCard from '../../../elements/RewardCard';
import helpers from '../../../functions/helpers.js';
import Modal from 'react-bootstrap/Modal';
import {Button, ButtonToolbar} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const TaskId = () => {
    const router = useRouter();
    console.log("jeanpaul", router.query);
    const taskId = router.query.taskId;

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [taskData, setTaskData] = useState({});
    const [users, setUsers] = useState([]);

    const [show, setShow] = useState(false);
    const [claimDisable, setClaimDisable] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // let users = [];

    let claimTask = () => {
        if(claimDisable == false){
            console.log(router.query);
            router.push(`/task/${taskId}/claim`);
        }
        else{
            setErrMsg("Sponsors of a task couldn't claim it");
            setShowAlert(true);
        }
    }

    let upTaskReward = () => {
        console.log("Upping it!");
        handleShow();
    }

    let rewardJson = {};
    
    let rewardData = (category, count) => {
        let id = helpers.rewardID(category); // fetch id for the selected reward
        rewardJson[id] = count;
    }

    const addReward = async() => {
        console.log(rewardJson);

        let rewardFlag = 0;
        let keys = Object.keys(rewardJson);
        // Check if rewards have not been left empty
        keys.map((key) => { 
            if(rewardJson[key] > 0){
                rewardFlag = 1;
            }
        })

        if(rewardFlag == 0){
            setErrMsg("No rewards added!");
            handleClose();
            setShowAlert(true);
            return;
        }

        try{
            let taskData = {
                rewardChanges: JSON.stringify(rewardJson),
                requestID: taskId,
                email: "s@a.com",
                loginToken: "$2b$10$QYVP.E7ikEJqhc8GwbsYauq9E7PPkgR39iyFVriFqlytZjJVQnE/e"
            }

            let result = await fetch("/api/request/sponsor", { method: "PUT", headers: taskData});
            let json = await result.json();
            console.log("kya?", json);
            if(json.success == true){
                handleClose();
                fetchTaskDetails();
            }
        }
        catch(err){
            console.log(err);
        }
            
    }

    const fetchTaskDetails = async() => {
        try{
            let fetchJson = {
                email: "s@a.com",
                loginToken: "$2b$10$QYVP.E7ikEJqhc8GwbsYauq9E7PPkgR39iyFVriFqlytZjJVQnE/e",
                requestId: taskId
            }
            let result = await fetch("/api/request", {method: "GET", headers: fetchJson});
            let json = await result.json();
            json.output.createdAt = helpers.readableDate(json.output.createdAt);
            console.log("kya?", json);
            setTaskData(json.output);
            let sponsors = Object.keys(json.output.rewards);
            setUsers(sponsors);
            sponsors.map((user) => {
                console.log("ujer", user);

                if(user == "s@a.com")
                    setClaimDisable(true);
            })
            
        }
        catch(err){
            console.log(err);
        }
        }

    useEffect(() => {fetchTaskDetails()}, [])




    return (
        <>
            <Header></Header>
            <div className="task-new-class">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 task-image-holder">

                            <img src={`/proof_images/${taskData.taskImagePath}`} alt="Task Image" className="task-image container"></img>

                        </div>
                        <div className="col-md-9">

                            <h2 className="forward-page-header">{taskData.title}</h2>
                            <p>{taskData.description}</p>
                            <p>Created by <strong>{taskData.creatorEmail}</strong> at <i>{(taskData.createdAt)}</i></p>
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-md-12 contributors">
                            <h4>Contributors for this Task</h4>
                        </div>
                    </div>
                    <div className="row">
                        {/* {individualUser} */}
                        {
                            users.map((key) => {
                                console.log("albela", key);
                                return <IndividualRewardCard user={key} rewards={taskData.rewards[key]}></IndividualRewardCard>
                            })
                            
                        }

                    </div>
                    <hr/>
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! Error processing the request!</Alert.Heading>
                        <p>
                        {errMsg}
                        </p>
                    </Alert>

                    <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary right  btn-forward-main" aria-disabled={claimDisable} onClick={() => claimTask()}>Claim Task</button>
                        <button className="btn btn-outline-primary mr-3 right btn-forward-main" onClick={() => upTaskReward()}>Add Reward Task</button>
                    </div>
                </div>
                </div>


      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w" centered>
        <Modal.Header>
          <Modal.Title>Choose rewards you want to add to this task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="container text-center">
                <div className="row reward-cont">
                    <div className="col-md-2">
                        <RewardCard img="../../../images/coffee.png" category="Coffee" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../../../images/candy.png" category="Candy" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../../../images/meal.png" category="Meal" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../../../images/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../../../images/drink.png" category="Drink" amount={rewardData}></RewardCard>
                    </div>
                    
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => addReward()}>
            Add Reward
          </Button>
        </Modal.Footer>
      </Modal>



            </div>

        </>
    )


}

export default TaskId;