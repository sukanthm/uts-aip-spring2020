import Header from '../template-parts/Header';
import TaskContainer from '../elements/TaskContainer';
const Dashboard = (props) => {
    //Sample JSON data
    let taskData = {
        task1: {
            title: "Clean the Fridge",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget nulla sed purus sodales auctor ultrices convallis metus. Integer tincidunt eros eu metus sollicitudin sodales. Vestibulum vel tellus hendrerit, dignissim risus nec, tincidunt mauris. Ut nunc turpis, fermentum venenatis sodales facilisis, interdum vel risus.",
            img: "../images/fridge.jpg",
            rewardsData: [
                {
                    coffee: 2,
                    snacks: 1
    
                }
            ],
            createdBy: "User 2",
            createdAt: "08/06/2020"
        }
    };


    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search for tasks" />
                                <button type="submit" className="btn btn-primary">Search</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <TaskContainer taskImg={taskData.task1.img} taskTitle={taskData.task1.title} taskDesc={taskData.task1.desc}></TaskContainer>
                </div>
            </div>
        </>
    );
}

export default Dashboard;