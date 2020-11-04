import { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import ErrorContainer from './ErrorContainer';
import FavorContainer from './FavorContainer';
import LoadingComponent from './LoadingComponent';
import UserContext from '../functions/context';



const SettledFavorsContainer = (props) => {

    if (!props.user.targetEmail) return null;

    const { sessionCheck } = useContext(UserContext);

    let targetEmail = String(props.user.targetEmail).trim().replace(/(?![\x00-\x7F])./g, '');
    function test_data_sanity(){
        if (targetEmail != props.user.targetEmail){
            return false;
        } return true;
    }

    const itemsPerPage = 10;
    const currentPage = useRef(0);
    const router = useRouter();

    const [favorRows, setFavorRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const fetchFavors = async ( currentPage, itemsPerPage) => {
        try {
            
            let result = await fetch(`/api/favors/${targetEmail}?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: {statusFilter: props.type} });
            let json = await result.json();
            if (json.success == true) {
                if (json.output.currentPage == (json.output.totalPages - 1)) {
                    setMoreScroll(false);
                }
                const arr = [...favorRows];
                json.output.rows.map((row) => {
                    arr.push(row);
                })
                setFavorRows(arr);
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



    const fetchNext = () => {
        currentPage.current = currentPage.current + 1;
        fetchFavors(currentPage.current, itemsPerPage);
    }


    useEffect(() => {
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
        if (!test_data_sanity()){
            setErrMsg('bad chars detected: '+ props.user.targetEmail);
            setIsLoading(false);
            return;
        }
        fetchFavors(currentPage.current, itemsPerPage);
    }, []);


    if (favorRows.length > 0) {
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
                        dataLength={favorRows.length} //This is important field to render the next data
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
                            favorRows.map((key) => {
                                return <FavorContainer favorVals={key} key={key.id}></FavorContainer>
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
                <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Favors!" errMsg={errMsg}/>
            </>
             )}
             </>
        )
    }
}

export default SettledFavorsContainer;