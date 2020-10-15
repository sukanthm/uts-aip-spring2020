import {useEffect, useState, useRef} from 'react';
import Header from '../template-parts/Header';
import { useRouter } from 'next/router';
const Party = (props) => {
    const itemsPerPage = 5;
    const currentPage = useRef(0);
    const router = useRouter();

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const fetchTasks = async(status, currentPage, itemsPerPage, search) => {
        try{
        let fetchJson = {
                dashboardFilter: "Creator",
                requestStatus: status,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                searchData: search
            }
        let result = await fetch("/api/party", {method: "GET"});
            let json = await result.json();
            console.log("kya?", json);
            if(json.output.currentPage == (json.output.totalPages-1)){
                console.log("ruk gaya");
                setMoreScroll(false);
            }
        console.log("here");
            // let arr = taskRows;
            const arr = [...taskRows];
            json.output.rows.map((row) => {
                arr.push(row);
            })
            console.log("arro", arr);
            console.log("rumba", currentPage);
            setTaskRows(arr);
        }
        catch(err){
            console.log(err);
        }
        }


        useEffect(() => {fetchTasks("All", currentPage.current, itemsPerPage, "")}, []);


    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="party-container container-fluid">
                        <div className="task-des">
                            <b>Party Detected!</b>
                        </div>
                            <br/>
                        <div>
                            <b>People Involved in the party</b>
                            <br/>
                            <div>Person 1</div>
                            <div>Person 1</div>
                            <div>Person 1</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Party;