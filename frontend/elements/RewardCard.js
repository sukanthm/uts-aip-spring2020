import {useState, useEffect} from 'react';
import helpers from '../functions/helpers';

// Component to display each Reward associated with a user and update its value
const RewardCard = (props) => {
    
    // Assign itital value from API if available
    const [count, setCount] = useState(props.originalValue[helpers.rewardID(props.category)] || 0);
    
    function updateCount(operator){

        let val = count;
        if(operator == "+"){
            setCount(val + 1);
        }
        else if(operator == "-"){
            if(count > 0){
                setCount(val - 1);
            }
        }
    }

    useEffect(() => {
        // Send the count to parent component's function on update
        props.amount(props.category, count - (props.originalValue[helpers.rewardID(props.category)] || 0));
    }, [count])

    return(
        <div className="reward-card">
            <div className="container center reward-title">
                <h5>{props.category}</h5>
            </div>
            <div className="container reward-icon">
                <img src={props.img} alt={props.category} className="col-lg-12"></img>
            </div>
            <hr/>
            <div className="container">
                <div className="row reward-update">
                    <div className="reward-num-btn" onClick={() => updateCount("-")}>
                        -
                    </div>
                        <input type="number" placeholder="0" value={count} className="col-lg-6 reward-num"></input>
                    <div className="reward-num-btn" onClick={() => updateCount("+")}>
                        +
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RewardCard;
