import Header from '../template-parts/Header';
import ErrorContainer from '../elements/ErrorContainer';


const DeleteTask = (props) => {
    return(
        <>
            <Header />
            <ErrorContainer imgSrc="../images/error_container/delete.png" errTitle="Task Deleted Successfully!" errMsg="The task has been deleted because there were no rewards remaining." needBtn={true} btnMsg="Go to Home" />
        </>
    )
}

export default DeleteTask;