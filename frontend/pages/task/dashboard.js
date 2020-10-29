import Header from '../../template-parts/Header';
import CreatedContainer from '../../elements/CreatedContainer';
import SponsoredContainer from '../../elements/SponsoredContainer';
import CompletedContainer from '../../elements/CompletedContainer';
import ActiveLink from '../../template-parts/ActiveLink'
import { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const dashboard = (props) => {
   

    const [key, setKey] = useState('home');

    

    return (
        <>
            <Header />
            <div className="container">
                {/* Using Tabs from Bootstrap */}
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="home" title="Created by Me">
                        <div>
                            <CreatedContainer></CreatedContainer>
                        </div>
                    </Tab>
                    <Tab eventKey="profile" title="Sponsored by Me">
                        <div>
                            <SponsoredContainer></SponsoredContainer>   
                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Completed by Me">
                        <div>
                            <CompletedContainer></CompletedContainer>    
                        </div>
                    </Tab>
                </Tabs>
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
            </div>
        </>
    )
}

export default dashboard;