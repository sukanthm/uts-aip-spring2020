import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import TaskContainer from './TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'react-bootstrap/Alert';
import ErrorContainer from '../elements/ErrorContainer';
import FavorContainer from './FavorContainer';




const OpenFavorsContainer = (props) => {

    const itemsPerPage = 10;
    const currentPage = useRef(0);
    const router = useRouter();

    const [favorRows, setFavorRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const fetchFavors = async ( currentPage, itemsPerPage) => {
        try {
            
            let result = await fetch(`/api/favors/${props.user.userId}?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET", headers: {statusFilter: "Pending"} });
            let json = await result.json();
            console.log("kya?", json);
            if (json.success == true) {
                if (json.output.currentPage == (json.output.totalPages - 1)) {
                    console.log("ruk gaya");
                    setMoreScroll(false);
                }
                // let arr = taskRows;
                const arr = [...favorRows];
                json.output.rows.map((row) => {
                    arr.push(row);
                })
                console.log("arro", arr);
                console.log("rumba", currentPage);
                setFavorRows(arr);
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



    const fetchNext = () => {
        console.log("abhi", currentPage.current);
        currentPage.current = currentPage.current + 1;
        console.log("abhi bhi", currentPage.current);
        fetchFavors(currentPage.current, itemsPerPage);
    }


    useEffect(() => { fetchFavors(currentPage.current, itemsPerPage) }, []);


    if (favorRows.length > 0) {
        return (

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
                                console.log("enter", key);
                                return <FavorContainer favorVals={key} key={key.id}></FavorContainer>
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>

        );
    }
    else {
        return (
            <>
                <ErrorContainer imgSrc="../images/error_container/error.png" errTitle="No Favors Detected!" errMsg="You haven't given any favors yet." />
            </>
        )
    }
}

export default OpenFavorsContainer;