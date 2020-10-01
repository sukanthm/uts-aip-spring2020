import Header from '../template-parts/Header';
import { useState } from 'react';
import RewardCard from '../elements/RewardCard';
import UserCard from '../elements/UserCard';
const Login = (props) => {
    const [username, setUsername] = useState('John Smith');

    const [pending, setPending] = useState(17);

    let rewardJson = {};

    function rewardData(category, count) {
        rewardJson[category] = count;
    }

    return (
        <>
            <Header />

            <div className="main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-3 text-center">
                            <img src="../images/default-user.png" alt="Default User" width="100" />
                            <p><h3>{username}</h3></p>
                        </div>
                        <div className="col-9 text-center">
                            <div className="container">
                                <h2>GIFTING</h2>
                                <div className="row">
                                    <div className="col">
                                        <RewardCard img="../images/food.png" category="Food" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col">
                                        <RewardCard img="../images/candy.png" category="Candy" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col">
                                        <RewardCard img="../images/lunch.png" category="Lunch" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col">
                                        <RewardCard img="../images/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col">
                                        <RewardCard img="../images/soda.png" category="Drink" amount={rewardData}></RewardCard>
                                    </div>

                                </div>
                            </div>
                            <div className="search-favour">
                                <input class="form-control" type="text" placeholder="Search the person you want to gift..." aria-label="Search"/>

                            </div>
                            <div className="search-result">
                                <UserCard user={{
                                    id:1,
                                    name: 'Username'
                                }}>Test</UserCard>
                            </div>
                            <div className="search-result">
                                <UserCard user={{
                                    id:2,
                                    name: 'Username'
                                }} />
                            </div>
                            <button className="btn btn-primary right">Give</button>
                            <button className="btn btn-outline-primary right">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;