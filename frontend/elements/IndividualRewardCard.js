import {useState, useEffect} from 'react';

const IndividualRewardCard = (props) => {
 
    let rewards = Object.keys(props.rewards);

    return(
        <div className="individual-reward-card col-lg-3">
            <div className="container center">
                <h5>{props.user}</h5>
            </div>
            
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
                }
                
           
            
        </div>
    )
}

export default IndividualRewardCard;
