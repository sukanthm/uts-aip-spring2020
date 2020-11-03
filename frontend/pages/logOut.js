import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import { useEffect, useContext } from 'react';
import UserContext from '../functions/context';
import { useRouter } from 'next/router';

const logOut = (props) => {

    const { sessionCheck } = useContext(UserContext);
    const router = useRouter();
    useEffect(() => {
        if (sessionCheck('annonymous')) return; //reroutes loggedIn users
    }, []);

    return(
        <>
            <Header />
            <ErrorContainer imgSrc="/images/error_container/log-out.png" errTitle="Logged out Successfully!" errMsg="You are logged out To see your account please log in again." needBtn={true} btnMsg="Log In" destin="/login" />
        </>
    )
}

export default logOut;