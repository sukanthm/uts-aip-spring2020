
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';

const LoadingComponent = () => {


    return (
        <div className="container text-center">
            <h5>Loading</h5>
            {/* <img src="/images/logo.png" alt="IOU Logo" className="img-responsive logo-forward" /> */}
            {/* <br/> */}
            <img src="../images/loading.gif" alt="loading..." className="img-responsive logo-forward" />
            {/* <FontAwesomeIcon icon={faAtom}/> */}
        </div>
        
    )
}

export default LoadingComponent;