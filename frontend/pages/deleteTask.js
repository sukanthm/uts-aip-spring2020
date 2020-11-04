import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import {useEffect, useContext} from 'react';
import UserContext from '../functions/context';
import FABComponent from '../elements/FABComponent';



const DeleteTask = () => {
    //Check if user is logged in
    const { sessionCheck } = useContext(UserContext);

    useEffect(() => { 
        if (!sessionCheck('loggedIn')) return; //reroutes annonymous users
    }, []);
    return(
        <>
            <Header />
            <ErrorContainer imgSrc="/images/error_container/delete.png" errTitle="Task Deleted Successfully!" errMsg="The task has been deleted because there were no rewards remaining." needBtn={true} btnMsg="Go to Home"  destin="/"/>
            <FABComponent type="Task"></FABComponent>
       </>
    )
}

export default DeleteTask;