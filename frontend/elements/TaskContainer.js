;import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';
import helpers from '../functions/helpers.js';
import UserContext from '../functions/context';
import { useContext } from 'react';

// Component to display individual task in a list
const TaskContainer = (props) => {
    const router = useRouter();
    let taskImagePath;

    const { user } = useContext(UserContext);

    // Function to open Task detail page
    // Works only if the user is logged in
    // Other wise displays alert
    const detailedTask = (id) => {
        if(user){
            router.push("/task/" + id);
        }
        else{
            props.alert();
        }

    }

    // Display placeholder image for a task if none is available
    if(props.taskVals.taskImagePath.trim() == ""){
        taskImagePath = '/images/no_image.png';
    } else taskImagePath = `/api/image/${props.taskVals.taskImagePath}`;

    props.taskVals.createdAt = helpers.readableDate(props.taskVals.createdAt);
    if(props.taskVals.completedAt){
        props.taskVals.completedAt = helpers.readableDate(props.taskVals.completedAt)
    }

    return (

        <div className="task-container container-fluid" onClick={() => detailedTask(props.taskVals.id)}>
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={taskImagePath} alt="Task image" width="100%" />
                </div>
                <div className="col-sm-8 task-des">
                    <b>{props.taskVals.title}</b>
                    <p>{props.taskVals.description}</p>
                    <br/>
                    <br/>
                    
                    <b>Date:</b> {props.taskVals.createdAt}
                    <br/>
                    <b>Status:</b> <span className={"status-"+props.taskVals.status}>{props.taskVals.status}</span>
                    {
                        // Display completion date-time for the completed tasks only
                        props.taskVals.completedAt ? (
                        <div> <b>Completed at </b> {props.taskVals.completedAt} </div>
                        ) : (
                            null
                        )
                    }

                </div>
                <div className="col-sm-2">
                    <b>Rewards</b>
                    {/* // Display rewards associated with a task */}
                    <RewardsContainer rewardsData={props.taskVals.rewards} />
                </div>
            </div>
        </div>
    )
}

export default TaskContainer;