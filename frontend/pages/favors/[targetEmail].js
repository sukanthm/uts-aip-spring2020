import Header from '../../template-parts/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import helpers from '../../functions/helpers.js';

import FavorListContainer from '../../elements/FavorListContainer';


const UserId = () => {
    const Router = useRouter();
    const [key, setKey] = useState('open');
    
    useEffect(() => {
        if(!helpers.checkCookie()){
            Router.push("/");
        }
    }, []);

    console.log(Router.query);
    return(
        <>
        <Header></Header>
        <div className="container">
        <Tabs
                    id="controlled-tabs-favor"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="open" title="Open Favors">
                        <div>
                            <FavorListContainer user={Router.query} type="Pending"></FavorListContainer>
                        </div>
                    </Tab>
                    <Tab eventKey="settled" title="Settled Favors">
                        <div>
                        <FavorListContainer user={Router.query} type="Paid"></FavorListContainer>
                        </div>
                    </Tab>
                </Tabs>
        </div>
        </>
    )
}

export default UserId;