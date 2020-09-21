import {useState, useEffect} from 'react';

const RewardCard = (props) => {
    const [count, setCount] = useState(0);
    
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
        props.amount(props.category, count);
    }, [count])

    return(
        <div className="reward-card">
            <div className="container center">
                <h5>{props.category}</h5>
            </div>
            <div className="container reward-icon">
                <img src={props.img} alt={props.category} className="col-lg-12"></img>
            </div>
            <div className="container">
                <div className="row reward-update">
                    <div className="col-lg-3 reward-num-btn" onClick={() => updateCount("-")}>
                        -
                    </div>
                        <input type="number" placeholder="0" value={count} className="col-lg-6 reward-num"></input>
                    <div className="col-lg-3 reward-num-btn" onClick={() => updateCount("+")}>
                        +
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RewardCard;
