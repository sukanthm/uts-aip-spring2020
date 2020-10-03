import Header from '../../../template-parts/Header';
import TaskContainer from '../../../elements/TaskContainer';
import { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const TaskDashboard = (props) => {
    //Sample JSON data
    let taskData = 
        [
        {
            id: "task1",
            title: "Clean the Fridge",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget nulla sed purus sodales auctor ultrices convallis metus. Integer tincidunt eros eu metus sollicitudin sodales. Vestibulum vel tellus hendrerit, dignissim risus nec, tincidunt mauris. Ut nunc turpis, fermentum venenatis sodales facilisis, interdum vel risus.",
            img: "../../../images/fridge.jpg",
            rewardsData: 
                {
                    coffee: 2,
                    snacks: 1
                },
            
            createdBy: "User 2",
            createdAt: "08/06/2020"
        },
        {
            id: "task2",
            title: "Clean the Office",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget nulla sed purus sodales auctor ultrices convallis metus. Integer tincidunt eros eu metus sollicitudin sodales. Vestibulum vel tellus hendrerit, dignissim risus nec, tincidunt mauris. Ut nunc turpis, fermentum venenatis sodales facilisis, interdum vel risus.",
            img: "../../../images/office.jpg",
            rewardsData:
                {
                    cheers: 3,
                    drink: 1
                },
            
            createdBy: "User 2",
            createdAt: "08/06/2020"
        }
    ];

    const [key, setKey] = useState('home');

    let indivTask = taskData.map((key) => {
        // Iterate through each task from JSON
        return <TaskContainer taskVals={key}></TaskContainer>
    })

    return (
        <>
            <Header />
            <div className="container">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="home" title="Created by Me">
                        <div>
                    {indivTask}                

                        </div>
                    </Tab>
                    <Tab eventKey="profile" title="Sponsored by Me">
                        <div>
                    {indivTask}                

                        </div>
                    </Tab>
                    <Tab eventKey="contact" title="Completed by Me">
                        <div>
                    {indivTask}                

                        </div>
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default TaskDashboard;