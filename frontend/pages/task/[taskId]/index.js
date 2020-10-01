import { useRouter } from 'next/router';
import Header from '../../../template-parts/Header';
import IndividualRewardCard from '../../../elements/IndividualRewardCard';

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
        title: "Clean the Fridge",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget nulla sed purus sodales auctor ultrices convallis metus. Integer tincidunt eros eu metus sollicitudin sodales. Vestibulum vel tellus hendrerit, dignissim risus nec, tincidunt mauris. Ut nunc turpis, fermentum venenatis sodales facilisis, interdum vel risus.",
        img: "../../images/fridge.jpg",
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

    let individualUser = taskData.rewardsData.map((key) => {
        // Iterate through each user
        let keyVal = Object.keys(key)[0];    // Get value of the name of the user
        return <IndividualRewardCard user={keyVal} rewards={key[keyVal]}></IndividualRewardCard>
    }
    )

    return (
        <>
            <Header></Header>
            <div className="task-new-class">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 task-image-holder">

                            <img src={taskData.img} alt="Task Image" className="task-image container"></img>

                        </div>
                        <div className="col-md-9">

                            <h2 className="forward-page-header">{taskData.title}</h2>
                            <p>{taskData.desc}</p>
                            <p>Created by <strong>{taskData.createdBy}</strong> at {taskData.createdAt}</p>
                        </div>
                    </div>
                    <hr/>

                    <div className="row">
                        <div className="col-md-12 contributors">
                            <h4>Contributors for this Task</h4>
                        </div>
                    </div>
                    <div className="row">
                        {individualUser}
                    </div>

                    <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary right  btn-forward-main" onClick={() => claimTask()}>Claim Task</button>
                        <button className="btn btn-outline-primary mr-3 right btn-forward-main" onClick={() => upTaskReward()}>Add Reward Task</button>
                    </div>
                </div>
                </div>

                



            </div>

        </>
    )


}

export default TaskId;