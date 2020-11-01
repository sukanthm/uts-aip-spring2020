import { useEffect, useState, useRef, useContext } from 'react';
import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import helpers from '../functions/helpers.js';
import { useRouter } from 'next/router';
import UserContext from '../functions/context';
import LoadingComponent from '../elements/LoadingComponent';



    

const leaderboard = (props) => {
    const itemsPerPage = 10;
    const currentPage = useRef(0);
    const [leaderData, setLeaderData] = useState({});
    const Router = useRouter();
    const { sessionCheck } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        let result = await fetch("/api/leaderboard/1", { method: "GET" });
        let json = await result.json();
        if (json.success)
            setLeaderData(json.output);
            setIsLoading(false);
    }

    useEffect(() => { 
        sessionCheck();
        fetchTasks("All", currentPage.current, itemsPerPage, "") 
    }, []);
    // If leaders are detected

        return ( 
            <>
                <Header />
                <div hidden={!isLoading} className="container">
                    <h4>Top {itemsPerPage} Most Pending Incoming Favors:</h4>
                    <LoadingComponent></LoadingComponent>
                </div>

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

                <div hidden={isLoading || Object.keys(leaderData).length} className="container">
                    <ErrorContainer imgSrc="../images/error_container/error.png" 
                        errTitle="No Leaders Detected!" errMsg="Oh no. There are no active leaders currently." needBtn={true} btnMsg="Go to Home" destin="/" />
                </div>

            </>
        )
}
export default leaderboard;