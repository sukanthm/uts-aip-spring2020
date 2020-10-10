
import {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/router';
import Header from '../../../template-parts/Header';
import TaskContainer from '../../../elements/TaskContainer';
import InfiniteScroll from 'react-infinite-scroll-component';




const SearchText = (props) => {

    const itemsPerPage = 5;
    const currentPage = useRef(0);
    // const searchToggle = useRef(false);
    const router = useRouter();
    console.log(router.query);

    const searchText = router.query.searchText;
    const [taskRows, setTaskRows] = useState([]);
    const [moreScroll, setMoreScroll] = useState(true);

    const fetchTasks = async(status, currentPage, itemsPerPage, search) => {
        try{
            let fetchJson = {
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
            fetchTasks("All", currentPage.current, itemsPerPage, searchText);
        }

    

        useEffect(() => {fetchTasks("All", currentPage.current, itemsPerPage, searchText)}, []);

       
    return (
        <>
            <Header />
            <div className="dashboard-page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Search results for "{searchText}"</h2>
                        </div>
                    </div>
                    <hr />
                    

                    <InfiniteScroll
                    dataLength={taskRows.length} //This is important field to render the next data
                    next={fetchNext}
                    hasMore={moreScroll}
                    hasChildren={moreScroll}
                    loader={<h4>Loading...</h4>}
                    height={400}
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
        </>
    );
}

export default SearchText;