import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';

const logOut = (props) => {
    return(
        <>
            <Header />
            <ErrorContainer imgSrc="/images/error_container/log-out.png" errTitle="Logged out Successfully!" errMsg="You are logged out To see your account please log in again." needBtn={true} btnMsg="Log In" destin="/login" />
        </>
    )
}

export default logOut;