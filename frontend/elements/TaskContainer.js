const TaskContainer = (props) => {
    return (
        <div className="task-container container-fluid">
            <div className="row">
                <div className="col-sm-2">
                    <img className="task-img" src={props.taskImg} alt="Task image" width="100%" />
                </div>
                <div className="col-sm-8 task-des">
                    <b>{props.taskTitle}</b>
                    <p>{props.taskDesc}</p>
                </div>
                <div className="col-sm-2">
                    <p>Rewards</p>
                    <div className="rewards-container">
                        <img className="task-img" src="../images/candy.png" alt="Task image" width="30%" />
                        <img className="task-img" src="../images/candy.png" alt="Task image" width="30%" />
                        <img className="task-img" src="../images/cheers.png" alt="Task image" width="30%" />
                        <img className="task-img" src="../images/coffee.png" alt="Task image" width="30%" />
                        <img className="task-img" src="../images/coffee.png" alt="Task image" width="30%" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TaskContainer;