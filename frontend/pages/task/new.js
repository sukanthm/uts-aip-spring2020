import {useState, useEffect, useContext} from 'react';
import Header from '../../template-parts/Header';
import RewardCard from '../../elements/RewardCard';
import helpers from '../../functions/helpers.js';
import Alert from 'react-bootstrap/Alert';
import { useRouter } from 'next/router';
import UserContext from '../../functions/context';

const New = () => {

    const Router = useRouter();

    const [imgFile, setImgFile] = useState("/images/upload-img.png");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [formImg, setFormImg] = useState("");
    const { sessionCheck } = useContext(UserContext);
    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [rewardJson, setRewardJson] = useState({});
    
    useEffect(() => {
        if (!sessionCheck()) return; //reroutes annonymous users
    }, []);

    function uploadImage(file){
        setImgFile(URL.createObjectURL(file));
        setFormImg(file);
       
        // console.log("yoyo",image);
    }

    const submitTask = async() => {
        setShowAlert(false);
        
        try{
            if(taskTitle.trim() == ""){
                setErrMsg("Title cannot be left blank");
                setShowAlert(true);
                return;
            }
            if (taskTitle != taskTitle.replace(/(?![\x00-\x7F])./g, '')){
                setErrMsg('non ASCII characters are illegal in TITLE, remove to proceed');
                setShowAlert(true);
                return;
            }
            if (taskDesc != taskDesc.replace(/(?![\x00-\x7F])./g, '')){
                setErrMsg('non ASCII characters are illegal in DESCRIPTION, remove to proceed');
                setShowAlert(true);
                return;
            }
            if (Math.min.apply(null, Object.values(rewardJson)) <= 0 && 
                Math.max.apply(null, Object.values(rewardJson)) <= 0) {
                    setShowAlert(true);
                    setErrMsg('creator must sponsor some rewards to create a task');
                    return;
            }

            const formData = new FormData();
            formData.append('proofImage', formImg);

            // Title and Rewards are compulsory
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
            setErrMsg(err);
            setShowAlert(true);
        }
    }

    function rewardData(category, count){
        let id = helpers.rewardID(category); // get id for the selected reward
        let temp_json = rewardJson;
        temp_json[id] = count;
        setRewardJson(temp_json);
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
                        
                        

                        <div className="image-upload container center">
                            <label htmlFor="task-image-edit" className="image-upload-label">
                                Upload Image (optional)
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
                        <RewardCard img="/images/reward/coffee.png" category="Coffee" amount={rewardData} originalValue={{}}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="/images/reward/meal.png" category="Meal" amount={rewardData} originalValue={{}}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="/images/reward/snacks.png" category="Snacks" amount={rewardData} originalValue={{}}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="/images/reward/candy.png" category="Candy" amount={rewardData} originalValue={{}}></RewardCard>
                    </div>
                    <div className="col-md-2">
                        <RewardCard img="/images/reward/drink.png" category="Drink" amount={rewardData} originalValue={{}}></RewardCard>
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