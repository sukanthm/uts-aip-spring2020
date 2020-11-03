import Header from '../../template-parts/Header';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import helpers from '../../functions/helpers.js';
import UserContext from '../../functions/context';
import FABComponent from '../../elements/FABComponent';


import FavorListContainer from '../../elements/FavorListContainer';


const UserId = (props) => {
    const Router = useRouter();
    console.log(Router.query.type);
    const [key, setKey] = useState(Router.query.type);
    const { sessionCheck } = useContext(UserContext);
    
    useEffect(() => {
        if (!sessionCheck()) return;
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
                            <FavorListContainer user={Router.query} type="Pending"></FavorListContainer>
                        </div>
                    </Tab>
                    <Tab eventKey="Paid" title="Paid Favors">
                        <div>
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