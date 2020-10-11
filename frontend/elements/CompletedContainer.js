
import {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/router';
import Header from '../template-parts/Header';
import TaskContainer from './TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';




const CompletedContainer = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);
    const router = useRouter();

    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const fetchTasks = async(status, currentPage, itemsPerPage, search) => {
        try{
            let fetchJson = {
                dashboardFilter: "Completor",
                requestStatus: status,
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                searchData: search
            }
            let result = await fetch("/api/requests", {method: "GET", headers: fetchJson});
            let json = await result.json();
            console.log("kya?", json);
            if(json.output.currentPage == (json.output.totalPages-1)){
                console.log("ruk gaya");
                setMoreScroll(false);
            }
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

        

        const fetchNext = () => {
            console.log("abhi", currentPage.current);
            currentPage.current = currentPage.current + 1;
            console.log("abhi bhi", currentPage.current);
            fetchTasks("All", currentPage.current, itemsPerPage, "");
        }


        useEffect(() => {fetchTasks("All", currentPage.current, itemsPerPage, "")}, []);

       
    return (
       
            <div className="dashboard-page">
                <div className="container">
                    
                    <hr />
                    

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
                        console.log("enter");
                        return <TaskContainer taskVals={key} key={key.id}></TaskContainer>
                    })
                    }
                    </InfiniteScroll>
                </div>
            </div>
        
    );
}

export default CompletedContainer;