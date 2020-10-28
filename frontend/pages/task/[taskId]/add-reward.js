import Header from "../../../template-parts/Header"
import RewardCard from '../../../elements/RewardCard';

const AddReward = () => {

    let rewardJson = {};
    
    let rewardData = (category, count) => {
        rewardJson[category] = count;
    }

    let addReward = () => {
        console.log(rewardJson);
    }

    return(
        <>
        <Header></Header>
        <div className="container-fluid">
        <h2>Rewards</h2>
        <div className="container row">
            <div className="col-md-2">
                <RewardCard img="../../images/reward/coffee.png" category="Coffee" amount={rewardData}></RewardCard>
            </div>
            <div className="col-md-2">
                <RewardCard img="../../images/reward/candy.png" category="Candy" amount={rewardData}></RewardCard>
            </div>
            <div className="col-md-2">
                <RewardCard img="../../images/reward/meal.png" category="Meal" amount={rewardData}></RewardCard>
            </div>
            <div className="col-md-2">
                <RewardCard img="../../images/reward/snacks.png" category="Snacks" amount={rewardData}></RewardCard>
            </div>
            <div className="col-md-2">
                <RewardCard img="../../images/reward/drink.png" category="Drink" amount={rewardData}></RewardCard>
            </div>
            
        </div>
        <button className="btn btn-primary right" onClick={() => addReward()}>Up Reward</button>
        </div>
        </>
    )
}

export default AddReward;