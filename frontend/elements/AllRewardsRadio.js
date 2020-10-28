import { useState, useEffect } from 'react';

const AllRewardsRadio = (props) => {
    const [selectedRewardID, setSelectedRewardID] = useState(1);

    function setRadio(input, targetDOM){
        setSelectedRewardID(input);
        targetDOM.checked;
    }

    useEffect(() => {
        setRadio(selectedRewardID, document.getElementById('radio1')); //this should work, but doesnt set coffee checked on load
        props.id(selectedRewardID);
    }, [selectedRewardID]);

    return (
        <>
            <div className="container text-center">
                <form>
                    <div className="row reward-cont">

                        <div className="col-md-2">
                            <div className="reward-card">
                                <div className="container center reward-title">
                                    <h5>{'Coffee'}</h5>
                                </div>
                                <div className="container reward-icon">
                                    <img src='../images/coffee.png' className="col-lg-12"></img>
                                </div>
                                <hr />
                                <div className="container">
                                    <div className="row reward-update">
                                        <input id='radio1' name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setRadio(1,e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <div className="container center reward-title">
                                    <h5>{'Candy'}</h5>
                                </div>
                                <div className="container reward-icon">
                                    <img src='../images/candy.png' className="col-lg-12"></img>
                                </div>
                                <hr />
                                <div className="container">
                                    <div className="row reward-update">
                                        <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setRadio(2,e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="reward-card">
                                <div className="container center reward-title">
                                    <h5>{'Meal'}</h5>
                                </div>
                                <div className="container reward-icon">
                                    <img src='../images/meal.png' className="col-lg-12"></img>
                                </div>
                                <hr />
                                <div className="container">
                                    <div className="row reward-update">
                                        <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setRadio(3,e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <div className="container center reward-title">
                                    <h5>{'Snacks'}</h5>
                                </div>
                                <div className="container reward-icon">
                                    <img src='../images/snacks.png' className="col-lg-12"></img>
                                </div>
                                <hr />
                                <div className="container">
                                    <div className="row reward-update">
                                        <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setRadio(4,e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="reward-card">
                                <div className="container center reward-title">
                                    <h5>{'Drink'}</h5>
                                </div>
                                <div className="container reward-icon">
                                    <img src='../images/drink.png' className="col-lg-12"></img>
                                </div>
                                <hr />
                                <div className="container">
                                    <div className="row reward-update">
                                        <input name='radioForm' type="radio" className="reward-num-btn" onClick={(e) => setRadio(5,e.target)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default AllRewardsRadio;
