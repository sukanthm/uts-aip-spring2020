
import {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';
import TaskContainer from '../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import ActiveLink from '../template-parts/ActiveLink'
import Alert from 'react-bootstrap/Alert';



const Dashboard = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);
    // const searchToggle = useRef(false);
    const router = useRouter();

    const [taskRows, setTaskRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchToggle, setSearchToggle] = useState(false);
    const [moreScroll, setMoreScroll] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

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
            if(json.output.currentPage == (json.output.totalPages-1)){
                console.log("ruk gaya");
                setMoreScroll(false);
            }
            // let arr = taskRows;
            const arr = [...taskRows];
            json.output.rows.map((row) => {
                arr.push(row);
            })
            console.log("arro", arr);
            console.log("rumba", currentPage);
            setTaskRows(arr);
        }
        catch(err){
            console.log(err);
        }
        }

        const alert = () => {
            setErrMsg("Log in to view task");
            setShowAlert(true);
        }

        

        const fetchNext = () => {
            console.log("abhi", currentPage.current);
            currentPage.current = currentPage.current + 1;
            console.log("abhi bhi", currentPage.current);
            fetchTasks("All", currentPage.current, itemsPerPage, searchText);
        }

        const sendSearch = () => {
            console.log("search text", searchText);
            if(searchText.trim()!=""){
                router.push("/task/search/" + searchText);
                // setSearchToggle(true);
                // setTaskRows([]);
                // currentPage.current = 0;
            }
            else{
                // setSearchToggle(false);
            }
            // fetchTasks("All", currentPage.current, itemsPerPage, searchText);
        }

        useEffect(() => {fetchTasks("All", currentPage.current, itemsPerPage, searchText)}, []);

        // useEffect(() => {
            
        //     setTaskRows([]);
        //     currentPage.current = 0;
        //     console.log("uzeAffect", taskRows);
        //     fetchTasks("All", currentPage.current, itemsPerPage, searchText)
        // }, [searchToggle]);

        // useEffect(() => {
            
        //    console.log("hoying?");
        // }, [taskRows]);

    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search for tasks" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                                <button type="submit" className="btn btn-primary" onClick={() => sendSearch()}>Search</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Oh snap! Error in loading task!</Alert.Heading>
                        <p>
                        {errMsg}
                        </p>
                    </Alert>
                    <InfiniteScroll
                    dataLength={taskRows.length} //This is important field to render the next data
                    next={fetchNext}
                    hasMore={moreScroll}
                    hasChildren={moreScroll}
                    loader={<h4>Loading...</h4>}
                    height={700}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                        </p>
                    }
                    
                    >
                    {
                    taskRows.map((key) => {
                        console.log("enter");
                        return <TaskContainer taskVals={key} key={key.id} alert={alert}></TaskContainer>
                    })
                    }
                    </InfiniteScroll>
                </div>

                <div className="cust-fab">
                    <div>
                        <ActiveLink activeClassName="active" href="/task/new">
                            <button type="submit" className="btn btn-primary cust-float-new">Add Task</button>
                        </ActiveLink>    
                    </div>
                    {/* <br/> */}
                    {/* <div><button type="submit" className="btn btn-light">Add Favour</button></div> */}
                </div>
            </div>
        </>
    );
}

export default Dashboard;