import ErrorContainer from '../../../elements/ErrorContainer';
import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../template-parts/Header';
import TaskContainer from '../../../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import UserContext from '../../../functions/context';
import LoadingComponent from '../../../elements/LoadingComponent';




const SearchText = (props) => {
    const Router = useRouter();
    const searchText = Router.query.searchText;
    if (!searchText) return null;

    const itemsPerPage = 5;
    const currentPage = useRef(0);

    //const { sessionCheck } = useContext(UserContext);

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
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
        fetchTasks("All", currentPage.current, itemsPerPage, searchText);
    }



    useEffect(() => {
        //if (!sessionCheck()) return; //this page is no auth
        fetchTasks("All", currentPage.current, itemsPerPage, searchText)
    }, []);


    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Search results for "{searchText}"</h2>
                        </div>
                    </div>
                    <hr />
                    {isLoading ? <LoadingComponent></LoadingComponent> : null}

                    <div hidden={isLoading || taskRows.length > 0}>
                        <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Search Results!" errMsg="There are currently no tasks available that match your seach criteria." />
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
                                return <TaskContainer taskVals={key} key={key.id}></TaskContainer>
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>
        </>
    );
}

export default SearchText;