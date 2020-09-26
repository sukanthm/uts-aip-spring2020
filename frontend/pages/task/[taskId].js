import { useRouter } from 'next/router';
import Header from '../../template-parts/Header';
import IndividualRewardCard from '../../elements/IndividualRewardCard';

const TaskId = () => {
    const router = useRouter();


    let claimTask = () => {
        console.log(router.query);
    }

    let upTaskReward = () => {
        console.log("Upping it!");
    }
    
    //Sample JSON data
    let taskData = {
        title: "Task 1",
        desc: "Description 1",
        img: "../../images/outbox.png",
        rewardsData: [
            {
                "User 1": {
                coffee: 2,
                snacks: 1
                }
            },
            {
                "User 2": {
                meal: 1,
                drink: 3
                }
            }
        ],
        createdBy: "User 2",
        createdAt: "08/06/2020"
        };

        let individualUser = taskData.rewardsData.map((key) => 
            {   
                // Iterate through each user
                let keyVal = Object.keys(key)[0];    // Get value of the name of the user
                return <IndividualRewardCard user={keyVal} rewards={key[keyVal]}></IndividualRewardCard>
            }
        )

        return(
            <>
            <Header></Header>
            <div className="task-new-class">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 task-image-holder">
                        
                        <img src={taskData.img} alt="Task Image" className="task-image container"></img>
                        
                    </div>
                    <div className="col-md-10">
                        
                        <h2>{taskData.title}</h2>
                        <p>{taskData.desc}</p>
                        <p>Created by <strong>{taskData.createdBy}</strong> at {taskData.createdAt}</p>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row">
                    {individualUser}
                </div>
            </div>

            
            <button className="btn btn-outline-primary" onClick={() => upTaskReward()}>Add Reward Task</button>
            <button className="btn btn-primary right" onClick={() => claimTask()}>Claim Task</button>
        </div>
            
            </>
        )

        
    }

    export default TaskId;