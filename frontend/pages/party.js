import { useEffect, useState, useRef,useContext } from 'react';
import Header from '../template-parts/Header';
import helpers from '../functions/helpers.js';
import ErrorContainer from '../elements/ErrorContainer';
import UserContext from '../functions/context';
import LoadingComponent from '../elements/LoadingComponent';

// Component to display party data
const Party = () => {
    const [partyData, setPartyData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const { sessionCheck } = useContext(UserContext);

    // Fetch party data from api
    const fetchTasks = async () => {
        try{
            let result = await fetch("/api/party", { method: "GET" });
            let json = await result.json();
            if (json.success)
                setPartyData(json.output);
                setIsLoading(false);
        } catch (err){
            setPartyData({});
            console.log(err);
        }
    }

    useEffect(() => { 
        // Check if user is logged in
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
        fetchTasks();
    }, []);

       return (
            <>
                <Header />
                <div hidden={!isLoading} className="container">
                    <LoadingComponent></LoadingComponent>
                </div>
                
                {/* Show data when party is detected */}
                <div hidden={!Object.keys(partyData).length} className="container">
                    <div className="row">
                        {
                            Object.keys(partyData).map((key) => {
                                return (
                                    <div className="col-md-6">
                                        <div className="party-container">
                                            <div className="task-des">
                                                {/* Printing name of the reward */}
                                                <h4><span>Party Detected for reward:</span> <b>{helpers.rewardTitle(key)}</b></h4>
                                            </div>
                                            <hr />
                                            <div>
                                                {
                                                    // looping through party data and showing the people involved in the party
                                                    partyData[key].map((row, index) => {
                                                        return (
                                                            <div>
                                                                <b>Party: {index + 1}</b>
                                                                <p>{row.join('; ')}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                
                {/* Show empty message when party is not detected */}
                <div hidden={isLoading || Object.keys(partyData).length} className="container">
                    <ErrorContainer imgSrc="/images/error_container/error.png" errTitle="No Party Detected!" 
                        errMsg="You are not involved in any parties yet. Parties are formed when reward loops occur." 
                        needBtn={true} btnMsg="Go to Home" destin="/"/>
                </div>

            </>
        )
}

export default Party;