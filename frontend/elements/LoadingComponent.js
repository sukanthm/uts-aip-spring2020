
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';

const LoadingComponent = () => {


    return (
        <div>
            <FontAwesomeIcon icon={faAtom} spin/>
        </div>
        
    )
}

export default LoadingComponent;