import RewardsContainer from './RewardsContainer';

const TaskContainer = (props) => {
    console.log(props.taskVals);
    console.log(props.taskVals.rewardsData);
    let rewardNames = Object.keys(props.taskVals.rewardsData);
    console.log(rewardNames);

    let rewardCaller = rewardNames.map((key) => {
        console.log(key);
        console.log(props.taskVals.rewardsData[key]);
        return (
            <div>
                <img className="task-img" src={"../images/" + key + ".png"} alt="Task image" width="30%" /> <b>X {props.taskVals.rewardsData[key]}</b>
            </div>)
    })

    return (

        <div className="task-container container-fluid">
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={props.taskVals.img} alt="Task image" width="100%" />
                </div>
                <div className="col-sm-8 task-des">
                    <b>{props.taskVals.title}</b>
                    <p>{props.taskVals.desc}</p>
                </div>
                <div className="col-sm-2">
                    <p>Rewards</p>
                    <RewardsContainer rewardNames={rewardNames} rewardsData={props.taskVals.rewardsData} />
                    
                </div>
            </div>

        </div>
    )
}

export default TaskContainer;