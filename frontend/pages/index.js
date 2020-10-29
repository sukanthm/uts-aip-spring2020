import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';
import TaskContainer from '../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import ActiveLink from '../template-parts/ActiveLink';
import Alert from 'react-bootstrap/Alert';
import UserContext from '../functions/context';
import ErrorContainer from '../elements/ErrorContainer';


const Dashboard = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);
    // const searchToggle = useRef(false);
    const router = useRouter();

    const [taskRows, setTaskRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchToggle, setSearchToggle] = useState(false);
    const [moreScroll, setMoreScroll] = useState(true);
    const [taskData, setTaskData] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const { user, logout } = useContext(UserContext);

    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
                requestStatus: status,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                searchData: search
            }
            let result = await fetch("/api/requests", { method: "GET", headers: fetchJson });
            let json = await result.json();
            console.log("kya?", json);
            setTaskData(json.output);
            if (json.success == true) {
                if (json.output.currentPage == (json.output.totalPages - 1)) {
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
            else if (json.success == false) {
                setErrMsg(json.message);
                setShowAlert(true);
            }
        }
        catch (err) {
            console.log(err);
            setErrMsg("Server Error");
            setShowAlert(true);
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
        if (searchText.trim() != "") {
            router.push("/task/search/" + searchText);
            // setSearchToggle(true);
            // setTaskRows([]);
            // currentPage.current = 0;
        }
        else {
            // setSearchToggle(false);
        }
        // fetchTasks("All", currentPage.current, itemsPerPage, searchText);
    }


    // useEffect(() => {

    //     setTaskRows([]);
    //     currentPage.current = 0;
    //     console.log("uzeAffect", taskRows);
    //     fetchTasks("All", currentPage.current, itemsPerPage, searchText)
    // }, [searchToggle]);

    // useEffect(() => {

    //    console.log("hoying?");
    // }, [taskRows]);

    useEffect(() => { fetchTasks("All", currentPage.current, itemsPerPage, searchText) }, []);
      if(taskRows.length>0){  
        return (
            <>
                <Header />
                <div className="dashboard-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for tasks" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
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
                    {user ? (
                        <div className="cust-fab">
                            <div>
                                <ActiveLink activeClassName="active" href="/task/new">
                                    <button type="submit" className="btn btn-primary cust-float-new">Add Task</button>
                                </ActiveLink>    
                            </div>
                            <hr/> {/* //need to put makeup here */}
                            <div>
                                <ActiveLink activeClassName="active" href="/favor/new">
                                    <button type="submit" className="btn btn-primary cust-float-new">Add Favor</button>
                                </ActiveLink>    
                            </div>
                        </div>
                    ) : (
                            null
                        )
                    }



                </div>
            </>
        )
    }
    else {
        return (
            <>
                <Header />
                <ErrorContainer imgSrc="../images/error_container/error.png" errTitle="No Tasks Detected!" errMsg="There are currently no tasks available. Create a new task to get started."/>
                {user ? (
                <div className="cust-fab">
                    <div>
                        <ActiveLink activeClassName="active" href="/task/new">
                            <button type="submit" className="btn btn-primary cust-float-new">Add Task</button>
                        </ActiveLink>    
                    </div>
                    <hr/> {/* //need to put makeup here */}
                    <div>
                        <ActiveLink activeClassName="active" href="/favor/new">
                            <button type="submit" className="btn btn-primary cust-float-new">Add Favor</button>
                        </ActiveLink>    
                    </div>
                </div>
                    ) : (
                            null
                        )
                    }
            </>
        )
    }
}

export default Dashboard;