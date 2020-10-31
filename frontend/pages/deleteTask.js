import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import helpers from '../functions/helpers.js';
import { useRouter } from 'next/router';
import {useEffect} from 'react';



const DeleteTask = (props) => {

    const Router = useRouter();
    useEffect(() => { 
        if(!helpers.checkCookie()){
            Router.push("/");
        }
    }, []);
    return(
        <>
            <Header />
            <ErrorContainer imgSrc="../images/error_container/delete.png" errTitle="Task Deleted Successfully!" errMsg="The task has been deleted because there were no rewards remaining." needBtn={true} btnMsg="Go to Home"  destin="/"/>
        </>
    )
}

export default DeleteTask;