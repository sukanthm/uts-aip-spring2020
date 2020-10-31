
import UserContext from '../functions/context';
import { useContext, useState } from 'react';
import helpers from '../functions/helpers';
import { useRouter } from 'next/router';

const FavorContainer = (props) => {

    const { user } = useContext(UserContext);
    const Router = useRouter();
    
    const openFavor = () => {
        console.log("konsa?", props.favorVals.id);
        Router.push(`/favor/${props.favorVals.id}`);
    }

    console.log(props);

    let stringData = "";


    if(props.favorVals.status == "Pending"){
        if(user == props.favorVals.payerEmail){
                 stringData =  `${props.favorVals.payeeEmail} owes you a ${helpers.rewardTitle(props.favorVals.rewardID)} created on ${helpers.readableDate(props.favorVals.createdAt)}`;
        }
        else if(user == props.favorVals.payeeEmail){
                stringData =  `You owe ${props.favorVals.payerEmail} a ${helpers.rewardTitle(props.favorVals.rewardID)} created on ${helpers.readableDate(props.favorVals.createdAt)}`;
        }
    }
    else if(props.favorVals.status == "Paid"){
        if(user == props.favorVals.payerEmail){
                stringData =  ` ${props.favorVals.payeeEmail} returned your ${helpers.rewardTitle(props.favorVals.rewardID)} on ${helpers.readableDate(props.favorVals.paidAt)}`;
        }
        else if(user == props.favorVals.payerEmail){
                stringData =  ` You returned ${props.favorVals.payeeEmail}'s ${helpers.rewardTitle(props.favorVals.rewardID)} on ${helpers.readableDate(props.favorVals.paidAt)}`;
        }
    }

    console.log("ka?", stringData);

    return (
        <div className="container" onClick={() => openFavor()}>
            <p>
                {stringData}
            </p>
            <button>Go</button>
        </div>
    );
}

export default FavorContainer;