import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';
import TaskContainer from '../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import UserContext from '../functions/context';
import ErrorContainer from '../elements/ErrorContainer';
import FABComponent from '../elements/FABComponent';
import LoadingComponent from '../elements/LoadingComponent';

const Dashboard = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [taskRows, setTaskRows] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [moreScroll, setMoreScroll] = useState(true);
    const [taskData, setTaskData] = useState({});

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const { user, logout } = useContext(UserContext);

    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
                requestStatus: status,
                searchData: search
            }
            let result = await fetch(`/api/requests?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: fetchJson });
            let json = await result.json();

            setTaskData(json.output);
            if (json.success == true) {
                if (json.output.currentPage == (json.output.totalPages - 1)) {
                    setMoreScroll(false);
                }

                const arr = [...taskRows];
                json.output.rows.map((row) => {
                    arr.push(row);
                })
                setTaskRows(arr);
                setIsLoading(false);
            }
            else if (json.success == false) {
                setErrMsg(json.message);
                setIsLoading(false);
                setShowAlert(true);
            }
        }
        catch (err) {
            setErrMsg("err");
            setIsLoading(false);
            setShowAlert(true);
        }
    }

    const alert = () => {
        setErrMsg("Log in to view task");
        setShowAlert(true);
    }



    const fetchNext = () => {
        currentPage.current = currentPage.current + 1;
        fetchTasks("All", currentPage.current, itemsPerPage, searchText);
    }

    const sendSearch = () => {
        if (searchText.trim() != "") {
            router.push("/tasks/search/" + searchText);
        }
    }

    useEffect(() => { fetchTasks("All", currentPage.current, itemsPerPage, searchText) }, []);
    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search tasks by reward, title, description" 
                                    value={searchText} onChange={(e) => setSearchText(e.target.value)} 
                                    onKeyDown={(e) => {if(e.key === "Enter") sendSearch();}}/>
                                <button type="submit" className="btn btn-primary" onClick={() => sendSearch()}>Search</button>
                            </div>
                        </div>
                    </div>
                    <hr />

                    {isLoading ? <LoadingComponent></LoadingComponent> : null}
                    <div hidden={isLoading || taskRows.length > 0}>
                        <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Tasks Detected!" errMsg="There are currently no tasks available. Create a new task to get started." />
                    </div>

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
                {
                    user ? (
                        <FABComponent type="All"></FABComponent>
                    ) : (
                            null
                        )
                }
            </div>
        </>
    )

}

export default Dashboard;