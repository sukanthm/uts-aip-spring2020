import { route } from 'next/dist/next-server/server/router';
import { useRouter } from 'next/router'
import RewardsContainer from './RewardsContainer';

const UserCard = (props) => {

    const Router = useRouter();

    console.log("propsiya rahein", props);

    const routeUser = () => {
        Router.push(`/favor/user/${props.userName}`)
    }

    return(
        <div className="col-md-6" onClick={() => routeUser()}>
            <div className="center">{props.userName}</div>
            <div>
            {   
                props.userData.outgoing ? (
                    <div className="col-md-12">
                    <div>Rewards to be paid</div>
                        <RewardsContainer rewardsData={props.userData.outgoing} />
                    </div>
                )
                : 
                null
            }
            </div>
            <div>
            {
                props.userData.incoming ? (
                    <div className="col-md-12">
                    <div>Rewards you are owed</div>
                        <RewardsContainer rewardsData={props.userData.incoming} />
                    </div>
                )
               : 
               null
            }
            </div>
        </div>
    )
}

export default UserCard;
