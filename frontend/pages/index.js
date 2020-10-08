
import {useEffect, useState} from 'react';
import Header from '../template-parts/Header';
import TaskContainer from '../elements/TaskContainer';

const itemsPerPage = 5;
let currentPage = 0;


const Dashboard = (props) => {

    const [taskRows, setTaskRows] = useState([]);

    const fetchTasks = async(status, currentPage, itemsPerPage, search) => {
        try{
            let fetchJson = {
                requestStatus: status,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                searchData: search
            }
            let result = await fetch("/api/requests", {method: "GET", headers: fetchJson});
            let json = await result.json();
            console.log("kya?", json);
            setTaskRows(json.output.rows);
        }
        catch(err){
            console.log(err);
        }
        }

        useEffect(() => {fetchTasks("All", currentPage, itemsPerPage, "")}, [])

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
                    {
                    
                    taskRows.map((key) => {
                        return <TaskContainer taskVals={key}></TaskContainer>
                    })}
                </div>
            </div>
        </>
    );
}

export default Dashboard;