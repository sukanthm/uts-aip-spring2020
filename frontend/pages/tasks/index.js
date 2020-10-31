import Header from '../../template-parts/Header';
import TaskListContainer from '../../elements/TaskListContainer';
import ActiveLink from '../../template-parts/ActiveLink'
import { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import helpers from '../../functions/helpers.js';
import { useRouter } from 'next/router';

const dashboard = (props) => {
   
    const Router = useRouter();
    const [key, setKey] = useState('home');

    useEffect(() => { 
        if(!helpers.checkCookie()){
            Router.push("/");
        }
    }, []);

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
                            <TaskListContainer type="Creator"></TaskListContainer>
                        </div>
                    </Tab>
                    <Tab eventKey="profile" title="Sponsored by Me">
                        <div>
                            <TaskListContainer type="Sponsor"></TaskListContainer>  
                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Completed by Me">
                        <div>
                            <TaskListContainer type="Completor"></TaskListContainer>    
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