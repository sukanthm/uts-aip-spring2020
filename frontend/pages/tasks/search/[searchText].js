import ErrorContainer from '../../../elements/ErrorContainer';
import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../../../template-parts/Header';
import TaskContainer from '../../../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import UserContext from '../../../functions/context';
import LoadingComponent from '../../../elements/LoadingComponent';



// Component to display search results
const SearchText = (props) => {
    const Router = useRouter();

    // Check if searchText exists inititally, return null if not
    if (!Router.query.searchText) return null;

    const { sessionCheck } = useContext(UserContext);

    const [searchText, setSearchText] = useState(String(Router.query.searchText).replace(/(?![\x00-\x7F])./g, ''));
    function test_data_sanity(){ //force all user input to only ASCII
        if (searchText != Router.query.searchText){
            setSearchText(Router.query.searchText);
            setErrMsg('non ASCII characters are illegal in SEARCH box, remove to proceed');
            setIsLoading(false);
            setShowAlert(true);
            return false;
        } return true;
    }

    const itemsPerPage = 5;
    const currentPage = useRef(0);

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // Function to search fetch Task data from API
    const fetchTasks = async (status, currentPage, itemsPerPage, search) => {
        try {
            let fetchJson = {
                requestStatus: status,
                searchData: search
            }

            let result = await fetch(`/api/requests?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: fetchJson });
            let json = await result.json();
            if (json.success == true) {
                // Check if the current page is the last one
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
            setErrMsg(err);
            setIsLoading(false);
            setShowAlert(true);
        }
    }

    const alert = () => {
        setErrMsg("Log in to view task");
        setShowAlert(true);
    }


    // Infinite scroll function to update current page and request new data
    const fetchNext = () => {
        currentPage.current = currentPage.current + 1;
        fetchTasks("All", currentPage.current, itemsPerPage, searchText);
    }



    useEffect(() => {
        sessionCheck(); //allow both annonymous & loggedIn users; refresh cookie status
        if (!test_data_sanity()) return;
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

                    <div hidden={isLoading || taskRows.length > 0 || showAlert}>
                        <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Search Results!" errMsg="There are currently no tasks available that match your seach criteria." />
                    </div>

                    <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)}>
                        <Alert.Heading>Oh snap! Error in loading tasks!</Alert.Heading>
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
                                // Display Task rows from fetched data list
                                return <TaskContainer taskVals={key} key={key.id} alert={alert}></TaskContainer>
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>
        </>
    );
}

export default SearchText;