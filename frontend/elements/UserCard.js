import { route } from 'next/dist/next-server/server/router';
import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';

const UserCard = (props) => {
    const Router = useRouter();
    const routeUser = () => {
        Router.push(`/favors/${props.userName}?type=${props.type}`)
    }

    return(
        <div className="col-md-6" onClick={() => routeUser()}>
            <div className="task-container">
            <div className="forward-cust-title">{props.userName}</div>
            <br/>
            <div className="container-fluid">
            <div className="row">
            {   
                props.userData.outgoing ? (
                    <div className="col-6">
                        <b>{props.type==='Pending' ? 'Rewards to be paid' : 'Rewards you paid'}</b>
                        <RewardsContainer rewardsData={props.userData.outgoing} />
                    </div>
                )
                : 
                null
            }
            {
                props.userData.incoming ? (
                    <div className="col-6">
                        <b>{props.type==='Pending' ? 'Rewards you are owed' : 'Rewards you were owed'}</b>
                        <RewardsContainer rewardsData={props.userData.incoming} />
                    </div>
                )
               : 
               null
            }
            </div>
            </div>
            </div>
        </div>
    )
}

export default UserCard;
