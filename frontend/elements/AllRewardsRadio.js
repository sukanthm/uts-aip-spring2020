import { useState, useEffect } from 'react';

const AllRewardsRadio = (props) => {
    const [selectedRewardID, setSelectedRewardID] = useState('');
    const [dynamicClass1, setDynamicClass1] = useState('');
    const [dynamicClass2, setDynamicClass2] = useState('');
    const [dynamicClass3, setDynamicClass3] = useState('');
    const [dynamicClass4, setDynamicClass4] = useState('');
    const [dynamicClass5, setDynamicClass5] = useState('');

    function setRadio(input, targetCLass){
        setSelectedRewardID(input);
        setDynamicClass1('');
        setDynamicClass2('');
        setDynamicClass3('');
        setDynamicClass4('');
        setDynamicClass5('');

        if(targetCLass == "class1")
            setDynamicClass1('select-me');

        else if(targetCLass == "class2")
            setDynamicClass2('select-me');

        else if(targetCLass == "class3")
            setDynamicClass3('select-me');

        else if(targetCLass == "class4")
            setDynamicClass4('select-me');

        else if(targetCLass == "class5")
            setDynamicClass5('select-me');
    }

    useEffect(() => {
        props.id(selectedRewardID);
    }, [selectedRewardID]);

    return (
        <>
            <div className="container text-center">
                <form>
                    <div className="row reward-cont">

                        <div className="col-md-2">
                            <div className={`favor-reward-card ${dynamicClass1}`}>
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Coffee'}</h5>
                                    </div>
                                
                                    <div className="container reward-icon">
                                        <img src='/images/reward/coffee.png' className="col-lg-12"></img>
                                    </div>
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input id='radio1' name='radioForm' type="radio" className="reward-selector" onClick={(e) => setRadio(1, "class1")} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className={`favor-reward-card ${dynamicClass2}`}>
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Meal'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='/images/reward/meal.png' className="col-lg-12"></img>
                                    </div>
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-selector" onClick={(e) => setRadio(2,  "class2")} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className={`favor-reward-card ${dynamicClass3}`}>
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Snacks'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='/images/reward/snacks.png' className="col-lg-12"></img>
                                    </div>
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-selector" onClick={(e) => setRadio(3,  "class3")} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className={`favor-reward-card ${dynamicClass4}`}>
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Candy'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='/images/reward/candy.png' className="col-lg-12"></img>
                                    </div>
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-selector" onClick={(e) => setRadio(4,  "class4")} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className={`favor-reward-card ${dynamicClass5}`}>
                                <label>
                                    <div className="container center reward-title">
                                        <h5>{'Drink'}</h5>
                                    </div>
                                    <div className="container reward-icon">
                                        <img src='/images/reward/drink.png' className="col-lg-12"></img>
                                    </div>
                                    <div className="container">
                                        <div className="row reward-update">
                                            <input name='radioForm' type="radio" className="reward-selector" onClick={(e) => setRadio(5,  "class5")} />
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
