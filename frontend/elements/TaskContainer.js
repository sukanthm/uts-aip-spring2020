import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';

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

    return (

        <div className="task-container container-fluid" onClick={() => detailedTask(props.taskVals.id)}>
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={`proof_images/${props.taskVals.taskImagePath}`} alt="Task image" width="100%" />
                </div>
                <div className="col-sm-8 task-des">
                    <b>{props.taskVals.title}</b>
                    <p>{props.taskVals.description}</p>
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