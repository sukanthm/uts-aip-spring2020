import { useEffect, useState, useRef } from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
import helpers from '../functions/helpers.js';
import ActiveLink from '../template-parts/ActiveLink';
import ErrorContainer from '../elements/ErrorContainer';


const Party = (props) => {
    const itemsPerPage = 5;
    const currentPage = useRef(0);
    const router = useRouter();
    const [partyData, setPartyData] = useState({});

    const fetchTasks = async () => {
        try {
            let result = await fetch("/api/party", { method: "GET" });
            let json = await result.json();
            console.log("kya?", json);
            setPartyData(json.output);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => { fetchTasks("All", currentPage.current, itemsPerPage, "") }, []);

       return (
            <>
                <Header />
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
                                                                <b>People for Party No: {index + 1}</b>
                                                                <p>{row.join()}</p>
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
                
                <ErrorContainer hidden={Object.keys(partyData).length} imgSrc="../images/error_container/error.png" errTitle="No Party Detected!" 
                    errMsg="You are not involved in any parties yet. Keep giving and receiving favours to have a party." 
                    needBtn={true} btnMsg="Go to Home" destin="/"/>

                <div className="cust-fab">
                    <div>
                        <ActiveLink activeClassName="active" href="/task/new">
                            <button type="submit" className="btn btn-primary cust-float-new">Add Task</button>
                        </ActiveLink>    
                    </div>
                    <hr/> {/* //need to put makeup here */}
                    <div>
                        <ActiveLink activeClassName="active" href="/favor/new">
                            <button type="submit" className="btn btn-primary cust-float-new">Add Favor</button>
                        </ActiveLink>    
                    </div>
                </div>
            </>
        )
}

export default Party;