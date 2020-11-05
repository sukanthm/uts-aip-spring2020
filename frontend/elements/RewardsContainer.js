import RewardItem from './RewardItem';
import helpers from '../functions/helpers'

export default class RewardsContainer extends React.Component{
   // a container with RewardItem(s)
    render(){
        const rewardNames = Object.keys(this.props.rewardsData);
        const rewardsData = this.props.rewardsData;
        return(<div className="rewards-container">
            {rewardNames.map((reward,index) => {
                const rewardTitle = helpers.rewardTitle(reward);
                return <RewardItem reward={rewardTitle} count={rewardsData[reward]} key={index}/>
            })}
        </div>);
    }
}