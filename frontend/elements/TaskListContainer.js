import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import TaskContainer from './TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import ErrorContainer from './ErrorContainer';
import LoadingComponent from './LoadingComponent';




const TaskListContainer = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);
    const router = useRouter();

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    console.log(props);
    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
                dashboardFilter: props.type,
                requestStatus: status,
                searchData: search
            }
            let result = await fetch(`/api/requests?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: fetchJson });
            let json = await result.json();
            console.log("kya?", json);
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
                setIsLoading(false);
            }
            else if (json.success == false) {
                setErrMsg(json.message);
                setIsLoading(false);
                setShowAlert(true);
            }
        }
        catch (err) {
            console.log(err);
            setErrMsg("Server Error");
            setIsLoading(false);
            setShowAlert(true);
        }
    }



    const fetchNext = () => {
        console.log("abhi", currentPage.current);
        currentPage.current = currentPage.current + 1;
        console.log("abhi bhi", currentPage.current);
        fetchTasks("All", currentPage.current, itemsPerPage, "");
    }


    useEffect(() => { fetchTasks("All", currentPage.current, itemsPerPage, "") }, []);

    
    if (taskRows.length > 0) {
        console.log("checkiya", taskRows);
        return (
            <>
            {
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
                                console.log("enter");
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
                <ErrorContainer imgSrc="../images/error_container/error.png" errTitle="No Tasks Detected!" errMsg="You haven't completed any task yet." />
            </>
             )}
             </>
        )
    }
}

export default TaskListContainer;