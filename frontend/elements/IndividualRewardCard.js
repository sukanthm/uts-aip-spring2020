import {useState, useEffect} from 'react';
import RewardsContainer from './RewardsContainer';

const IndividualRewardCard = (props) => {
    console.log("ghusu", props);
 
    let rewards = Object.keys(props.rewards);
    console.log(rewards);

    return(
        <div className="individual-reward-card col-lg-3">
            <div className="container">
                <h5>{props.user}</h5>
            <RewardsContainer rewardsData={props.rewards}></RewardsContainer>
            </div>
{/*             
                {
                    rewards.map((key) => 
                        {   //Iterating through each reward for a user
                            let img = "../images/" + key + '.png';
                            return (
                            <div className="row">
                            <img src={img} alt={key} className="" height="40" width="40"></img>
                            <strong>*</strong>
                            {props.rewards[key]}
                            
                            </div>
                            );
                        }
                    )
                } */}
                
           
            
        </div>
    )
}

export default IndividualRewardCard;
