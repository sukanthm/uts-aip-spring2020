import { useEffect, useState, useRef, useContext } from 'react';
import TaskContainer from './TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import ErrorContainer from './ErrorContainer';
import LoadingComponent from './LoadingComponent';
import UserContext from '../functions/context';

//Component displaying list of individual tasks
const TaskListContainer = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { sessionCheck } = useContext(UserContext);

    // Function to fetch task data from API
    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
                dashboardFilter: props.type,
                requestStatus: status,
                searchData: search
            }
            let result = await fetch(`/api/requests?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: fetchJson });
            let json = await result.json();
            if (json.success == true) {
                // Check if current page is the last one
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
            // Alert for user in case of failure
            else if (json.success == false) {
                setErrMsg(json.message);
                setIsLoading(false);
                setShowAlert(true);
            }
        }
        catch (err) {
            setErrMsg(err);
            setIsLoading(false);
            setShowAlert(true);
        }
    }
    // Function to update the page value and fetch data
    const fetchNext = () => {
        currentPage.current = currentPage.current + 1;
        fetchTasks("All", currentPage.current, itemsPerPage, "");
    }


    useEffect(() => { 
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
        fetchTasks("All", currentPage.current, itemsPerPage, "") 
    }, []);

    
    if (taskRows.length > 0) {
        return (
            <>
            {
                // Loading screen logic inspired from https://stackoverflow.com/questions/53868223/how-to-correctly-do-a-loading-screen-using-react-redux
                isLoading ? (
                <LoadingComponent></LoadingComponent>
            ) : (
            <div className="dashboard-page">
                <div className="container">

                    <hr />
                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Oh snap! Error processing the request!</Alert.Heading>
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
                                // Display each task in list using TaskContainer
                                return <TaskContainer taskVals={key} key={key.id}></TaskContainer>
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>
             )}
             </>

        );
    }
    else {
        return (
            <>
            {
                isLoading ? (
                <LoadingComponent></LoadingComponent>
            ) : (
            <>
                <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Tasks detected for this category!" />
            </>
             )}
             </>
        )
    }
}

export default TaskListContainer;