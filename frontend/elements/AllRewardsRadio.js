import { useState, useEffect } from 'react';

const AllRewardsRadio = (props) => {
    const [selectedRewardID, setSelectedRewardID] = useState('');

    // function setRadio(input, targetDOM){
    //     setSelectedRewardID(input);
    //     targetDOM.checked;
    // }

    useEffect(() => {
        // setRadio(1, document.getElementById('radio1')); //this should work, but doesnt set coffee checked on load
        props.id(selectedRewardID);
    }, [selectedRewardID]);

    return (
        <>
            <div className="container text-center">
                <form>
                    <div className="row reward-cont">

                        <div className="col-md-2">
                            <div className="reward-card">
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Coffee'}</h5>
                                    </div>
                                
                                    <div className="container reward-icon">
                                        <img src='../images/reward/coffee.png' className="col-lg-12"></img>
                                    </div>
                                    <hr />
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input id='radio1' name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setSelectedRewardID(1)} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Candy'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='../images/reward/candy.png' className="col-lg-12"></img>
                                    </div>
                                    <hr />
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setSelectedRewardID(2)} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="reward-card">
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Meal'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='../images/reward/meal.png' className="col-lg-12"></img>
                                    </div>
                                    <hr />
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setSelectedRewardID(3)} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Snacks'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='../images/reward/snacks.png' className="col-lg-12"></img>
                                    </div>
                                    <hr />
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setSelectedRewardID(4)} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Drink'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='../images/reward/drink.png' className="col-lg-12"></img>
                                    </div>
                                    <hr />
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setSelectedRewardID(5)} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default AllRewardsRadio;
