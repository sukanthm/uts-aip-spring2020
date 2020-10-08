import RewardItem from './RewardItem';
import helpers from '../functions/helpers'

export default class RewardsContainer extends React.Component{
   
    render(){
        const rewardNames = Object.keys(this.props.rewardsData);
        const rewardsData = this.props.rewardsData;
        return(<div className="rewards-container">
            {rewardNames.map((reward) => {
                const rewardTitle = helpers.rewardTitle(reward);
                console.log("titli", rewardTitle);
                return <RewardItem reward={rewardTitle} count={rewardsData[reward]}/>
            })}
        </div>);
    }
}