
export default class FavorPay extends React.Component{
    constructor(props) {    
        super(props);    
        this.state = {
            priorFavor: null,      
            selectedFavor: null,
            nextFavor: null   
        };  
    }
    getRewardSet(){
        const rewardNames = Object.keys(this.props.rewardsData);
        let prior = null, current = null,next = null;
        
        if(this.state.selectedFavor){
            const positionCurrent = rewardNames.indexOf(this.state.selectedFavor);
            if(positionCurrent != -1){
                current = this.state.selectedFavor;
                if(rewardNames[positionCurrent + 1]){
                    next = rewardNames[positionCurrent + 1];
                }
                if(rewardNames[positionCurrent - 1]){
                    prior = rewardNames[positionCurrent - 1];
                }else{
                    if(rewardNames.length > 2){
                        prior = rewardNames[rewardNames.length - 1];
                    }
                }
            }
        }
        if(!current){
            current = rewardNames[0];
            if(rewardNames[1]){
                next = rewardNames[1];
            }
            if(rewardNames.length > 2){
                prior = rewardNames[rewardNames.length - 1];
            }
        }
        this.setState({
            priorFavor: prior,      
            selectedFavor: current,
            nextFavor: next   
        });
        return (
            <>
            
                <div className='scroll-favor prior-favor'>
                    <div className={'icon-favor fi fi-favor-'+ this.state.selectedFavor}></div>
                </div>
                <div className='scroll-favor selected-favor'>
                    <div className={'icon-favor fi fi-favor-'+ this.state.selectedFavor}></div>
                </div>
                <div className='scroll-favor next-favor'>
                    <div className={'icon-favor fi fi-favor-'+ this.state.selectedFavor}></div>
                </div>
                <a href="javascript:void(0);" className="prior" onClick={()=>this.setState({
                    selectedFavor: this.state.priorFavor
                })}>
                    &laquo;
                </a>
                <a href="javascript:void(0);" className="next" onClick={()=>this.setState({
                    selectedFavor: this.state.nextFavor
                })}>
                    &raquo;
                </a>

            </>
        );
    }
    render(){
        
        return(
            <div className='favor-pay-box'>
                <div className='image-loader'>

                </div>
                <div className='payer'>
                    <UserCard user={this.props.payer} useBorder={false}></UserCard>
                </div>
                <div className='payee'>
                    <UserCard user={this.props.payee} useBorder={false}></UserCard>
                </div>
                <div className='rewards'>
                {this.getRewardSet()}
                </div>
            </div>
        );
    }
}