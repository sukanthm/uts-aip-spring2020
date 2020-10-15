import {useState, useEffect} from 'react';
import RewardsContainer from './RewardsContainer';

const IndividualRewardCard = (props) => {
 
    let rewards = Object.keys(props.rewards);
    console.log(rewards);

    return(
        <div className="individual-reward-card col-lg-3">
            <div className="container">
                <h5>{props.user}</h5>
            <RewardsContainer rewardsData={props.rewards}></RewardsContainer>
            </div>

                
           
            
        </div>
    )
}

export default IndividualRewardCard;
