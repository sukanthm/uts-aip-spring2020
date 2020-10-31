import Header from '../../template-parts/Header';
import ActiveLink from '../../template-parts/ActiveLink';
import RewardsContainer from '../../elements/RewardsContainer';
import UserCard from '../../elements/UserCard';
import helpers from '../../functions/helpers.js';
import Alert from 'react-bootstrap/Alert';
import { useRouter } from 'next/router';
import { useState,useEffect } from 'react';

const dashboard = (props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);

    const [users, setUsers] = useState({});
    const Router = useRouter();

    const fetchFavorData = async() => {
        try{
            let result = await fetch("/api/dashboard/favors", {method: "GET", headers: {statusFilter:"Pending"}});
            let json = await result.json();
            let len;
            
            if(json.success == true){
                setOutgoing(json.output.consolidated.outgoing || helpers.emptyRewardsDict);
                setIncoming(json.output.consolidated.incoming || helpers.emptyRewardsDict);

                if(json.output.byUser){
                    setUsers(json.output.byUser);
                }
            }
            else if(json.success == false){
                setErrMsg(json.message);
                setShowAlert(true);
                
            }
        }
        catch(err){
            setErrMsg(err);
            setShowAlert(true);
        }
      }

      useEffect(() => {
            if(!helpers.checkCookie()){
                Router.push("/");
            }
          fetchFavorData()
        }, []);

    return(
    <>
        <Header></Header>
        <div className="container">
           <div className="row">
            {   
                <div className="col-md-6">
                    <h4 className="forward-page-header">Total rewards to be paid</h4>
                    <RewardsContainer rewardsData={outgoing} />
                </div>
            }
            {
                <div className="col-md-6">
                    <h4 className="forward-page-header">Total rewards you are owed</h4>
                    <RewardsContainer rewardsData={incoming} />
                </div>
            }
            </div>
        </div>
            
        <div hidden={!Object.keys(users).length} className="container">
            <hr/>
            <h4 className="forward-page-header">Favors by users</h4>
            <div className="row">            
                {
                    Object.keys(users).map((key, i) => {
                        return <UserCard key={i} userData={users[key]} userName={key}></UserCard>;
                    })
                }
            </div>
        </div>

        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
            <Alert.Heading>Oh snap! Error in loading data!</Alert.Heading>
            <p>
                {errMsg}
            </p>
        </Alert>
            
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

export default dashboard;