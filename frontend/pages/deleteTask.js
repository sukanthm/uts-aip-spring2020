import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import { useRouter } from 'next/router';
import {useEffect, useContext} from 'react';
import UserContext from '../functions/context';
import FABComponent from '../elements/FABComponent';



const DeleteTask = (props) => {
    const { sessionCheck } = useContext(UserContext);

    const Router = useRouter();
    useEffect(() => { 
        if (!sessionCheck()) return; //reroutes annonymous users
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