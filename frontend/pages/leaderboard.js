import { useEffect, useState, useRef } from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
import ErrorContainer from '../elements/ErrorContainer';

const leaderboard = (props) => {
    const itemsPerPage = 5;
    const currentPage = useRef(0);
    const router = useRouter();
    const [leaderData, setLeaderData] = useState({});
    
    const fetchTasks = async () => {
        let result = await fetch("/api/leaderboard/1", { method: "GET" });
        let json = await result.json();
        if (json.success)
            setLeaderData(json.output);
    }

    useEffect(() => { fetchTasks("All", currentPage.current, itemsPerPage, "") }, [leaderData]);
    // If leaders are detected

        return (
            <>
                <Header />
                <div hidden={!Object.keys(leaderData).length} className="container">
                    <h4>Most Active Incoming Favors:</h4>
                    {
                        Object.keys(leaderData).map((key, index) => {
                            return (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="party-container">
                                            <div className="task-des">
                                                {/* Email address */}
                                                <h4><span>{index + 1}:</span> {key}: <small class="count badge badge-primary">{leaderData[key]}</small></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div hidden={Object.keys(leaderData).length} className="container">
                    <ErrorContainer imgSrc="../images/error_container/error.png" 
                        errTitle="No Leaders Detected!" errMsg="Oh no. There are no active leaders currently." needBtn={true} btnMsg="Go to Home" destin="/" />
                </div>
            </>
        )
    

}

export default leaderboard;