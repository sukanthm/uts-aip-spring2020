import { useEffect, useState, useRef } from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
import helpers from '../functions/helpers.js';
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
            <div className="container">
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
                                    <hr/>
                                    <div>
                                        {
                                            // looping through party data and showing the people involved in the party
                                            partyData[key].map((row, index) => {
                                                return (
                                                    <div>
                                                        <b>People for Party No: {index+1}</b>
                                                        <p>{row.join()}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    </div>
                                </div>
                            )

                            console.log("display temp:", helpers.rewardTitle(key));
                            partyData[key].map((row, index) => {
                                console.log("this is row:", row);
                                console.log(row.join());
                            })
                        })
                    }
                    {/* <div className="party-container container-fluid">
                        <div className="task-des">
                            <b>Party Detected!</b>
                        </div>
                        <br />
                        <div>
                            <b>People Involved in the party</b>
                            <br />
                            <div>Person 1</div>
                            <div>Person 1</div>
                            <div>Person 1</div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Party;