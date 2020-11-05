import Header from '../../template-parts/Header';
import TaskListContainer from '../../elements/TaskListContainer';
import ActiveLink from '../../template-parts/ActiveLink'
import { useState, useEffect, useContext } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import UserContext from '../../functions/context';
import FABComponent from '../../elements/FABComponent';

// Task dashboard component to display Task list containers
const dashboard = () => {
   
    const [key, setKey] = useState('home');
    const { sessionCheck } = useContext(UserContext);

    useEffect(() => { 
        
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
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
                    {/* Task list container in tabs */}
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
                
                <FABComponent type="Task"></FABComponent>
            </div>
        </>
    )
}

export default dashboard;