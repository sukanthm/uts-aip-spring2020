import Header from '../template-parts/Header';
import IconElement from '../elements/IconElement';
import { useState } from 'react';

const Login = (props) => {
    //Harris. I am not sure this is how we should use state to pass the data. Can you please have a look? Thanks.
    const [username, setUsername] = useState('John Smith');

    const [pending, setPending] = useState(17);

    return(
        <>
            <Header />

            <div className="main">
                <div className="container">
                    <div className="row">
                        <div className="col-3 text-center">
                            <img src="../images/default-user.png" alt="Default User" width="100"/>
                            <p><h3>{username}</h3></p>
                        </div>
                        <div className="col-9 text-center">
                            <div className="personal-nav">
                                <div className="nav-elements nav-selected">
                                    <img src="../images/default-user-selected.png" alt="Default User" width="30"/>
                                    <div>Personal</div>
                                </div>
                                <div className="nav-elements">
                                    <img src="../images/people.png" alt="Default User" width="30"/>
                                    <div>Office</div>
                                </div>
                                <div className="nav-elements">
                                    <img src="../images/hotel.png" alt="Default User" width="30"/>
                                    <div>Global</div>
                                </div>
                                <div className="nav-elements">
                                    <img src="../images/cheers.png" alt="Default User" width="30"/>
                                    <div>Party</div>
                                </div>
                            </div>
                            <div className="requests">
                                <div className="flex-container">
                                    <div className="box-elements">
                                        <p>PENDING</p>
                                        <h2>{pending}</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>IN PROGRESS</p>
                                        <h2>12</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>OWING</p>
                                        <h2>12</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>COMPLETE</p>
                                        <h2>12</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>TOTAL</p>
                                        <h2>12</h2>
                                    </div>
                                </div>
                                <p>Requests</p>
                            </div>
                            <div className="rewards">
                                <div className="flex-container">
                                    <div className="box-elements">
                                        <p>OWED</p>
                                        <h2>12</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>CLAIMED</p>
                                        <h2>12</h2>
                                    </div>
                                    <div className="box-elements">
                                        <p>TOTAL</p>
                                        <h2>12</h2>
                                    </div>
                                </div>
                                <p>Rewards</p>
                            </div>
                            <div className="tasks">
                                <div className="myTask">
                                    <img className="task-img" src="../images/photo.png" alt="Task image" width="1"/>
                                    <div className="task-des float-left">
                                        <b>Task</b>
                                        <p>Description of the task</p>
                                    </div>
                                    <div className="task-rew">
                                        <p>Rewards</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </>
    )
}

export default Login;