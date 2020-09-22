import Header from '../template-parts/Header';
import { useState } from 'react';
import RewardCard from '../elements/RewardCard';

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
                <div className="container">
                    <div className="row">
                        <div className="col-3 text-center">
                            <img src="../images/default-user.png" alt="Default User" width="100" />
                            <p><h3>{username}</h3></p>
                        </div>
                        <div className="col-9 text-center">
                            <div className="container-fluid">
                                <h2>GIFTING</h2>
                                <div className="container row">
                                    <div className="col-md-2">
                                        <RewardCard img="../images/food.png" category="Food" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col-md-2">
                                        <RewardCard img="../images/candy.png" category="Candy" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col-md-2">
                                        <RewardCard img="../images/lunch.png" category="Lunch" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col-md-2">
                                        <RewardCard img="../images/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
                                    </div>
                                    <div className="col-md-2">
                                        <RewardCard img="../images/soda.png" category="Drink" amount={rewardData}></RewardCard>
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