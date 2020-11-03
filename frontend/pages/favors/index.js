import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Header from '../../template-parts/Header';
import ActiveLink from '../../template-parts/ActiveLink';
import RewardsContainer from '../../elements/RewardsContainer';
import UserCard from '../../elements/UserCard';
import helpers from '../../functions/helpers.js';
import Alert from 'react-bootstrap/Alert';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../../functions/context';
import FABComponent from '../../elements/FABComponent';
import LoadingComponent from '../../elements/LoadingComponent';



const dashboard = (props) => {
    useEffect(() => {
        if (!sessionCheck()) return; //reroutes annonymous users
        fetchFavorData();
    }, []);

    const { sessionCheck } = useContext(UserContext);

    const [showAlert, setShowAlert] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [key, setKey] = useState('home');

    const [incomingPending, setIncomingPending] = useState([]);
    const [outgoingPending, setOutgoingPending] = useState([]);
    const [usersPending, setUsersPending] = useState({});

    const [incomingPaid, setIncomingPaid] = useState([]);
    const [outgoingPaid, setOutgoingPaid] = useState([]);
    const [usersPaid, setUsersPaid] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchFavorData = async () => {
        try {
            let result1 = await fetch("/api/dashboard/favors", { method: "GET", headers: { statusFilter: "Pending" } });
            let result2 = await fetch("/api/dashboard/favors", { method: "GET", headers: { statusFilter: "Paid" } });
            let json1 = await result1.json();
            let json2 = await result2.json();
            setIsLoading(false);

            if (json1.success) {
                setOutgoingPending(json1.output.consolidated.outgoing || helpers.emptyRewardsDict);
                setIncomingPending(json1.output.consolidated.incoming || helpers.emptyRewardsDict);
                setUsersPending(json1.output.byUser);
            }
            if (json2.success) {
                setOutgoingPaid(json2.output.consolidated.outgoing || helpers.emptyRewardsDict);
                setIncomingPaid(json2.output.consolidated.incoming || helpers.emptyRewardsDict);
                setUsersPaid(json2.output.byUser);
            }


            if (!json1.success) {
                setErrMsg(errMsg + json1.message);
                setShowAlert(true);
            }
            if (!json2.success) {
                setErrMsg(errMsg + json2.message);
                setShowAlert(true);
            }
        } catch (err) {
            setErrMsg(err);
            setIsLoading(false);
            setShowAlert(true);
        }
    }

    return (
        <>
            <Header></Header>
            <div className="container">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="home" title="Pending">
                        <br/>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 hidden={isLoading} className="forward-page-header">Total rewards you have yet to pay</h4>
                                    {isLoading ? <LoadingComponent></LoadingComponent> : null}
                                    <RewardsContainer rewardsData={outgoingPending} />
                                </div>

                                <div className="col-md-6">
                                    <h4 hidden={isLoading} className="forward-page-header">Total rewards you are yet to receive</h4>
                                    {isLoading ? <LoadingComponent></LoadingComponent> : null}
                                    <RewardsContainer rewardsData={incomingPending} />
                                </div>
                            </div>
                        </div>

                        <div hidden={!Object.keys(usersPending).length} className="container">
                            <hr />
                            <h4 className="forward-page-header">Pending Favors by users</h4>
                            <div className="row">
                                {
                                    Object.keys(usersPending).map((key, i) => {
                                        return <UserCard key={i} userData={usersPending[key]} userName={key} type='Pending'></UserCard>;
                                    })
                                }
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="away" title="Paid">
                        <br/>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 hidden={isLoading} className="forward-page-header">Total rewards you have paid</h4>
                                    {isLoading ? <LoadingComponent></LoadingComponent> : null}
                                    <RewardsContainer rewardsData={outgoingPaid} />
                                </div>

                                <div className="col-md-6">
                                    <h4 hidden={isLoading} className="forward-page-header">Total rewards you have received</h4>
                                    {isLoading ? <LoadingComponent></LoadingComponent> : null}
                                    <RewardsContainer rewardsData={incomingPaid} />
                                </div>
                            </div>
                        </div>

                        <div hidden={!Object.keys(usersPaid).length} className="container">
                            <hr />
                            <h4 className="forward-page-header">Paid Favors by users</h4>
                            <div className="row">
                                {
                                    Object.keys(usersPaid).map((key, i) => {
                                        return <UserCard key={i} userData={usersPaid[key]} userName={key} type='Paid'></UserCard>;
                                    })
                                }
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>


            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Oh snap! Error in loading data!</Alert.Heading>
                <p>
                    {errMsg}
                </p>
            </Alert>


            <FABComponent type="Favor"></FABComponent>

        </>
    )
}

export default dashboard;