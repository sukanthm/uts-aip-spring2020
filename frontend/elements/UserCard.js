import UserSVG from '../public/images/user.svg'
export default class UserCard extends React.Component{
    render(){
        const userColorId = this.props.user.id % 10;
        return(
        <div className={'user-card user-set-'+userColorId+((this.props.useBorder)?' user-bordered':'')}>
            <div className={'user-icon-wrap user-bg'}>
                <div className={'user-icon'}>
                    <UserSVG />
                </div>
            </div>
            <div className="user-name">{this.props.user.name}</div>
            <div className="user-content">
                {this.props.children}
            </div>
        </div>);
    }
}