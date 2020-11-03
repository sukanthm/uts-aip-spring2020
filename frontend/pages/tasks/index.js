import Header from '../../template-parts/Header';
import TaskListContainer from '../../elements/TaskListContainer';
import ActiveLink from '../../template-parts/ActiveLink'
import { useState, useEffect, useContext } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import helpers from '../../functions/helpers.js';
import { useRouter } from 'next/router';
import UserContext from '../../functions/context';
import FABComponent from '../../elements/FABComponent';


const dashboard = (props) => {
   
    const Router = useRouter();
    const [key, setKey] = useState('home');
    const { sessionCheck } = useContext(UserContext);

    useEffect(() => { 
        if (!sessionCheck()) return; //reroutes annonymous users
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
                
                <FABComponent type="Task"></FABComponent>
            </div>
        </>
    )
}

export default dashboard;