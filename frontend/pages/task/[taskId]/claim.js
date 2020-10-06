import {useState} from 'react';
import { useRouter } from 'next/router'
import Header from "../../../template-parts/Header"

const Claim = () => {

    const [imgFile, setImgFile] = useState("../../../images/outbox.png");
    const [taskComment, setTaskComment] = useState();

    function uploadImage(file){
        setImgFile(URL.createObjectURL(file));
    }

    let completeTask = () => {
        console.log(imgFile);
        console.log(taskComment);
    }
    const router = useRouter();
    const { taskId } = router.query;

    return(
        <>
        <Header></Header>
        <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 task-image-holder">
                        <img src={imgFile} alt="Upload Image" className="task-image container"></img>
                        <div className="task-image-upload container-fluid center">
                            <label htmlFor="task-image-edit">
                                <h6>Edit Image</h6>
                            </label>
                            <input type="file" onChange={(e) => uploadImage(e.target.files[0])} id="task-image-edit"></input>
                        </div>

                    </div>
                    <div className="col-md-10">
                        
                        <div className="form-group">
                            <label htmlFor="task-comment">Task Comment</label>
                            <textarea className="form-control" id="task-comment" placeholder="Task Comment" value={taskComment} onChange={(e) => setTaskComment(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary right" onClick={() => completeTask()}>Task Completed</button>
            </div>
            </>
    )

}

export default Claim;