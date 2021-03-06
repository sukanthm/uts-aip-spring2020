
import UserContext from '../functions/context';
import { useContext } from 'react';
import helpers from '../functions/helpers';
import { useRouter } from 'next/router';


//Container for individual favors in list
const FavorContainer = (props) => {

    const { user } = useContext(UserContext);
    const Router = useRouter();
    
    const openFavor = () => {
        // Routing to individual favor based on id
        Router.push(`/favor/${props.favorVals.id}`);
    }

    let stringData = "";
    let stringDate = "";

    // String to be displayed based on type of favor
    if(props.favorVals.status == "Pending"){
        if(user == props.favorVals.payerEmail){
                 stringData =  `${props.favorVals.payeeEmail} owes you a ${helpers.rewardTitle(props.favorVals.rewardID)}`;
                 stringDate =  `Created on ${helpers.readableDate(props.favorVals.createdAt)}`;
        }
        else if(user == props.favorVals.payeeEmail){
                stringData =  `You owe ${props.favorVals.payerEmail} a ${helpers.rewardTitle(props.favorVals.rewardID)}`;
                stringDate =  `Created on ${helpers.readableDate(props.favorVals.createdAt)}`;
            }
    }
    else if(props.favorVals.status == "Paid"){
        if(user == props.favorVals.payerEmail){
                stringData =  `${props.favorVals.payeeEmail} returned your ${helpers.rewardTitle(props.favorVals.rewardID)}`;
                stringDate =  `Paid on ${helpers.readableDate(props.favorVals.paidAt)}`;
        }
        else if(user == props.favorVals.payeeEmail){
                stringData =  `You returned ${props.favorVals.payerEmail}'s ${helpers.rewardTitle(props.favorVals.rewardID)}`;
                stringDate =  `Paid on ${helpers.readableDate(props.favorVals.paidAt)}`;
        }
    }

    return (
        <div className="task-container" onClick={() => openFavor()}>
            <p className="forward-cust-title">
                {stringData}
            </p>
            <p>
                {stringDate}
            </p>
        </div>
    );
}

export default FavorContainer;