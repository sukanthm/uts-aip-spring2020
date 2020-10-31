import {useState, useEffect} from 'react';
import Header from '../../template-parts/Header';
import RewardCard from '../../elements/RewardCard';
import helpers from '../../functions/helpers.js';
import Alert from 'react-bootstrap/Alert';
import { useRouter } from 'next/router';

const New = () => {

    const Router = useRouter();

    const [imgFile, setImgFile] = useState("../../images/upload-img.png");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [formImg, setFormImg] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    let rewardJson = {};
    
    useEffect(() => {
        if(!helpers.checkCookie()){
            Router.push("/");
        }
    }, []);

    function uploadImage(file){
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
       
        // console.log("yoyo",image);
    }

    const submitTask = async() => {
        
        console.log(taskTitle);
        console.log(taskDesc);
        console.log(imgFile);
        console.log(rewardJson);
        console.log("mama",formImg);
        const formData = new FormData();
        formData.append('proofImage', formImg);
         
        // let rewardFlag = 0;
        // let keys = Object.keys(rewardJson);
        // // Check if rewards have not been left empty
        // keys.map((key) => { 
        //     if(rewardJson[key] > 0){
        //         rewardFlag = 1;
        //     }
        // })

        // Title and Rewards are compulsory

        if(taskTitle.trim() == ""){
            setErrMsg("Title cannot be left blank");
            setShowAlert(true);
            return;
        }
        // else if(rewardFlag == 0){
        //     setErrMsg("Nothing in this world is free. Please add rewards to the task");
        //     setShowAlert(true);
        //     return;
        // }

        try{
            formData.append('title', taskTitle);
            formData.append('description', taskDesc);
            formData.append('rewards', JSON.stringify(rewardJson));

            let result = await fetch("/api/request", {credentials: 'include', method: "POST", body: formData});
            let json = await result.json();
            console.log("kya?", json);
            if(json.success == true)
                Router.push(`/task/${json.newRequestID}`);
            else{
            setErrMsg(json.message);
            setShowAlert(true);
            }
        }
        catch(err){
            console.log(err);
            setErrMsg("Server Error. Please try again later");
            setShowAlert(true);
            
        }
        
    }

    function rewardData(category, count){
        let id = helpers.rewardID(category); // fetch id for the selected reward
        rewardJson[id] = count;
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

            <hr/>

            <div className="container text-center">
                <h4 className="mb-5">Choose rewards you want to offer along with this task</h4>
                <div className="row reward-cont">
                    <div className="col-md-2">
                        <RewardCard img="../images/reward/coffee.png" category="Coffee" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/reward/candy.png" category="Candy" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/reward/meal.png" category="Meal" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/reward/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="../images/reward/drink.png" category="Drink" amount={rewardData}></RewardCard>
                    </div>
                    
                </div>

                <hr/>
                <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! Error in creating task!</Alert.Heading>
                        <p>
                        {errMsg}
                        </p>
                </Alert>
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary btn-lg btn-forward-main right" onClick={() => submitTask()}>Create Task</button>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default New;