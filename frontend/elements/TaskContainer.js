import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';
import helpers from '../functions/helpers.js';
import UserContext from '../functions/context';
import { useContext } from 'react';


const TaskContainer = (props) => {
    // console.log(props.taskVals);
    // console.log(props.taskVals.rewards);

    const router = useRouter();

    const { user } = useContext(UserContext);

    const detailedTask = (id) => {
        if(user){
            console.log("Khol rahe hain", id);
            router.push("/task/" + id);
        }
        else{
            console.log("user nahi");
        }

    }

    if(props.taskVals.taskImagePath.trim() == ""){
        props.taskVals.taskImagePath = "placeholder.jpg"
    }

    props.taskVals.createdAt = helpers.readableDate(props.taskVals.createdAt);

    return (

        <div className="task-container container-fluid" onClick={() => detailedTask(props.taskVals.id)}>
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={`/proof_images/${props.taskVals.taskImagePath}`} alt="Task image" width="100%" />
                </div>
                <div className="col-sm-8 task-des">
                    <b>{props.taskVals.title}</b>
                    <p>{props.taskVals.description}</p>
                    <br/>
                    <br/>
                    <b>Date:</b> {props.taskVals.createdAt}
                    <br/>
                    <b>Status:</b> <span className={"status-"+props.taskVals.status}>{props.taskVals.status}</span>
                </div>
                <div className="col-sm-2">
                    <p>Rewards</p>
                    <RewardsContainer rewardsData={props.taskVals.rewards} />
                </div>
            </div>
        </div>
    )
}

export default TaskContainer;