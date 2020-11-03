import { useEffect, useState, useRef, useContext } from 'react';
import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import UserContext from '../functions/context';
import LoadingComponent from '../elements/LoadingComponent';

const leaderboard = (props) => {
    const itemsPerPage = 10;
    const currentPage = 0;
    const [leaderData, setLeaderData] = useState({});
    const { sessionCheck } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        let result = await fetch(`/api/leaderboard/1?currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`, { method: "GET" });
        let json = await result.json();
        if (json.success)
            setLeaderData(json.output);
            setIsLoading(false);
    }

    useEffect(() => { 
        if (!sessionCheck()) return; //reroutes annonymous users
        fetchTasks("All", currentPage.current, itemsPerPage, "");
    }, []);

        return ( 
            <>
                <Header />
                <div hidden={!isLoading} className="container">
                    <LoadingComponent></LoadingComponent>
                </div>

                {/* Show result when leaderData is detected */}
                <div hidden={!Object.keys(leaderData).length} className="container">
                    <h4>Top {itemsPerPage} Most Pending Incoming Favors:</h4>
                    {
                        Object.keys(leaderData).map((rank, value) => {
                            return (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="party-container">
                                            <div className="task-des">
                                                {/* Email address */}
                                                <h4><span>{rank}:</span> {leaderData[rank][0].join('; ')}: <small class="count badge badge-primary">{leaderData[rank][1]}</small></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* Show empty message when leaderboard is empty */}
                <div hidden={isLoading || Object.keys(leaderData).length} className="container">
                    <ErrorContainer imgSrc="/images/error_container/error.png" 
                        errTitle="No Leaders Detected!" errMsg="Oh no. There are no active leaders currently." needBtn={true} btnMsg="Go to Home" destin="/" />
                </div>

            </>
        )
}
export default leaderboard;