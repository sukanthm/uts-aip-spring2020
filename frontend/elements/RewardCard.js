import {useState, useEffect} from 'react';
import helpers from '../functions/helpers';

const RewardCard = (props) => {
    
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
        // useEffect was used here as the count variable was being updated in the HTML, but value could not be used in the JS
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
