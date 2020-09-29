import {useState} from 'react';
import Header from '../../template-parts/Header';
import RewardCard from '../../elements/RewardCard';

const New = () => {

    const [imgFile, setImgFile] = useState("../../images/upload-img.png");
    const [taskTitle, setTaskTitle] = useState();
    const [taskDesc, setTaskDesc] = useState();

    let rewardJson = {};

    function uploadImage(file){
        setImgFile(URL.createObjectURL(file));
    }

    function submitTask(){
        console.log(taskTitle);
        console.log(taskDesc);
        console.log(imgFile);
        console.log(rewardJson);
        
    }

    function rewardData(category, count){
        rewardJson[category] = count;
    }

    return(
        <>
        <Header></Header>
        <div className="task-new-class">
            <div className="container">
                <h3 className="forward-page-header">Create New Task</h3>
                <hr/>
                <div className="row">
                    <div className="col-md-3 task-image-holder">
                        
                        
                        <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                        
                        

                        <div className="task-image-upload container center">
                            <label htmlFor="task-image-edit">
                                Add / Edit Image
                            </label>
                            <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-image-edit"></input>
                        </div>

                    </div>
                    <div className="col-md-9">
                        <div className="form-group forward-cust-title">
                            <label htmlFor="task-title">Task Title</label>
                            <input type="text" className="form-control" id="task-title" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}/>
                        </div>
                        <div className="form-group forward-cust-title">
                            <label htmlFor="task-desc">Task Description</label>
                            <textarea className="form-control" id="task-desc" placeholder="Task Description" rows="5" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <h2>Rewards</h2>
                <div className="row">
                    <div className="col-md-2">
                        <RewardCard img="../images/coffee.png" category="Coffee" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/candy.png" category="Candy" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/lunch.png" category="Meal" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/soda.png" category="Drink" amount={rewardData}></RewardCard>
                    </div>
                    
                </div>

                <hr/>

                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary btn-lg btn-forward-main right" onClick={() => submitTask()}>Create Task</button>
                    </div>
                </div>
            </div>
            {/* <div className="container-fluid">
                <div className="col-md-6 offset-md-3">
                <label htmlFor="reward-comment">Comment for Reward</label>
                <textarea className="form-control" id="reward-comment" placeholder="Additional comments related to reward"/>
                </div>
            </div> */}

        </div>
        </>
    )
}

export default New;