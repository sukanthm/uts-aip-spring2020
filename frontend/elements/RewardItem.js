export default class RewardItem extends React.Component{
    render(){
        return(
        <div className="reward-item">
            <p>{this.props.reward}</p>
            <div className={'reward-icon reward-'+this.props.reward}><small className="count badge badge-primary">{this.props.count}</small></div>
        </div>);
    }
}