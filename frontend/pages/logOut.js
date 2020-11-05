import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';
import { useEffect, useContext, useState } from 'react';
import UserContext from '../functions/context';
import { useRouter } from 'next/router';

const logOut = (props) => {

    const { sessionCheck } = useContext(UserContext);
    const [sessionCheckValue, setSessionCheckValue] = useState(false);
    let sessionCheckValueCopy = false;

    const router = useRouter();
    useEffect(() => {
        sessionCheckValueCopy = sessionCheck('annonymous'); //for instant js validation
        setSessionCheckValue(sessionCheckValueCopy); //for html update (as hooks update async)
        if (!sessionCheckValueCopy) return; //reroutes loggedIn users
    }, []);

    return(
        <>
            <Header />
            {sessionCheckValue ? 
                <ErrorContainer imgSrc="/images/error_container/log-out.png" errTitle="Logged out Successfully!" errMsg="You are logged out To see your account please log in again." needBtn={true} btnMsg="Log In" destin="/login" />
            : <></>}
        </>
    )
}

export default logOut;