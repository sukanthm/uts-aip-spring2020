//small icon with attached count
export default class RewardItem extends React.Component{
    render(){
        return(
        <div className="reward-item">
            <h6 className="forward-page-header">{this.props.reward}</h6>
            <div className={'reward-icon reward-'+this.props.reward}><small className="count badge badge-primary">{this.props.count}</small></div>
        </div>);
    }
}