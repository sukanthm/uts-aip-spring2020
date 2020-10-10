import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';
import helpers from '../functions/helpers.js';

const TaskContainer = (props) => {
    // console.log(props.taskVals);
    // console.log(props.taskVals.rewards);

    const router = useRouter();

    const detailedTask = (id) => {
        console.log("Khol rahe hain", id);
        router.push("/task/" + id);
    }

    if(props.taskVals.taskImagePath.trim() == ""){
        props.taskVals.taskImagePath = "placeholder.jpg"
    }

    props.taskVals.createdAt = helpers.readableDate(props.taskVals.createdAt);

    return (

        <div className="task-container container-fluid" onClick={() => detailedTask(props.taskVals.id)}>
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={`proof_images/${props.taskVals.taskImagePath}`} alt="Task image" width="100%" />
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