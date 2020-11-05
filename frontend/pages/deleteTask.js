import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import {useEffect, useContext, useState} from 'react';
import UserContext from '../functions/context';
import FABComponent from '../elements/FABComponent';


const DeleteTask = () => {
    
    const { sessionCheck } = useContext(UserContext);
    const [sessionCheckValue, setSessionCheckValue] = useState(false);
    let sessionCheckValueCopy = false;

    useEffect(() => { 
        sessionCheckValueCopy = sessionCheck('loggedIn'); //for instant js validation
        setSessionCheckValue(sessionCheckValueCopy); //for html update (as hooks update async)
        if (!sessionCheckValueCopy) return; //reroutes annonymous users
    }, []);
    return(
        <>
            <Header />
            {sessionCheckValue ? 
                <>
                    <ErrorContainer imgSrc="/images/error_container/delete.png" errTitle="Task Deleted Successfully!" errMsg="The task has been deleted because there were no rewards remaining." needBtn={true} btnMsg="Go to Home"  destin="/"/>
                    <FABComponent type="Task"></FABComponent>
                </>
            : <></>}
       </>
    )
}

export default DeleteTask;