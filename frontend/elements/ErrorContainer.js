import ActiveLink from '../template-parts/ActiveLink';
const ErrorContainer = (props) => {
    return (
        <div class="container">
            <div class="jumbotron text-center">
                <div class="view overlay my-4">
                    <img src={props.imgSrc} class="img-fluid" alt="" />
                    <a href="#">
                        <div class="mask rgba-white-slight"></div>
                    </a>
                </div>
                <h1 class="display-4">{props.errTitle}</h1>
                <br />
                <br />
                <p class="lead">{props.errMsg}</p>
                <br />
                {/* Check if a button is needed or not */}
                {props.needBtn ? (
                    <ActiveLink activeClassName="active" href="/">
                        <button type="submit" className="btn btn-primary btn-lg">{props.btnMsg}</button>
                    </ActiveLink>
                ) : (null)}
            </div>


        </div>
    )
}

export default ErrorContainer;