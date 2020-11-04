import Header from '../../template-parts/Header';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UserContext from '../../functions/context';
import FABComponent from '../../elements/FABComponent';
import FavorListContainer from '../../elements/FavorListContainer';

// Component to display favor Paid and Pending favor lists associated with a user
const UserId = () => {
    const Router = useRouter();
    console.log(Router.query.type);
    const [key, setKey] = useState(Router.query.type);
    const { sessionCheck } = useContext(UserContext);
    
    useEffect(() => {
        // Check if a user is logged in
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
    }, []);

    return(
        <>
        <Header></Header>
        <div className="container">
        <Tabs
                    id="controlled-tabs-favor"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="Pending" title="Pending Favors">
                        <div>
                            {/* // Favor list data for pending data */}
                            <FavorListContainer user={Router.query} type="Pending"></FavorListContainer>
                        </div>
                    </Tab>
                    <Tab eventKey="Paid" title="Paid Favors">
                        <div>
                            {/* // Favor list data for pending data */}
                            <FavorListContainer user={Router.query} type="Paid"></FavorListContainer>
                        </div>
                    </Tab>
                </Tabs>
                <FABComponent type="Favor"></FABComponent>
        </div>
        </>
    )
}

export default UserId;