import ActiveLink from '../template-parts/ActiveLink';
const ErrorContainer = (props) => {
    return (
        <div className="container">
            <div className="jumbotron text-center">
                <div className="view overlay my-4">
                    <img src={props.imgSrc} className="img-fluid" alt="" />
                    <a href="#">
                        <div className="mask rgba-white-slight"></div>
                    </a>
                </div>
                <h1 className="display-4">{props.errTitle}</h1>
                <br />
                <br />
                <p className="lead">{props.errMsg}</p>
                <br />
                {/* Check if a button is needed or not */}
                {props.needBtn ? (
                    <ActiveLink activeClassName="active" href={props.destin}>
                        <button type="submit" className="btn btn-primary btn-lg">{props.btnMsg}</button>
                    </ActiveLink>
                ) : (null)}
            </div>


        </div>
    )
}

export default ErrorContainer;