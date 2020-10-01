import RewardItem from './RewardItem';
export default class RewardsContainer extends React.Component{
   
    render(){
        const rewardNames = Object.keys(this.props.rewardsData);
        const rewardsData = this.props.rewardsData;
        return(<div className="rewards-container">
            {rewardNames.map((reward) => {
                return <RewardItem reward={reward} count={rewardsData[reward]}/>
            })}
        </div>);
    }
}