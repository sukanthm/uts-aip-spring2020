import Header from '../../template-parts/Header';
// import ActiveLink from '../../template-parts/ActiveLink';
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
    const [incomingLen, setIncomingLen] = useState(0);
    const [outgoing, setOutgoing] = useState([]);
    const [outgoingLen, setOutgoingLen] = useState(0);

    const [users, setUsers] = useState();
    const Router = useRouter();

    const fetchFavorData = async() => {
        try{
            let result = await fetch("/api/dashboard/favors", {method: "GET", headers: {statusFilter:"Pending"}});
            let json = await result.json();
            
            if(json.success == true){
                console.log("kya?", json);
                if(json.output.consolidated.outgoing){
                    setOutgoing(json.output.consolidated.outgoing);
                    let len = Object.keys(json.output.consolidated.outgoing).length;
                    setOutgoingLen(len);
                }
                if(json.output.consolidated.incoming){
                    setIncoming(json.output.consolidated.incoming);
                    let len = Object.keys(json.output.consolidated.incoming).length;
                    setIncomingLen(len);
                }
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
                outgoingLen ? (
                    <div className="col-md-6">
                    <h4 className="forward-page-header">Total rewards to be paid</h4>
                        <RewardsContainer rewardsData={outgoing} />
                    </div>
                )
                : 
                null
            }
            {
                incomingLen ? (
                    <div className="col-md-6">
                    <h4 className="forward-page-header">Total rewards you are owed</h4>
                        <RewardsContainer rewardsData={incoming} />
                    </div>
                )
               : 
               null
            }
            </div>
            <div>
            
            </div>
            
            <hr/>
            
            <h4 className="forward-page-header">Favors by users</h4>
            <div className="row">            {
                users ? (
                Object.keys(users).map((key, i) => {
                   return <UserCard key={i} userData={users[key]} userName={key}></UserCard>;
                })
                ) 
                : null
            }
            </div>
        </div>
             <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Oh snap! Error in loading data!</Alert.Heading>
                <p>
                    {errMsg}
                </p>
            </Alert>
        </>
    )
}

export default dashboard;